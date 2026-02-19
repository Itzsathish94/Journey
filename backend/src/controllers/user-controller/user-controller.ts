import { Request, Response } from "express";
import IUserController from "./interfaces/IUserController";
import IUserService from "../../services/user/interfaces/IUserService";
import bcrypt from "bcrypt";
import {
  SERVER_ERROR,
  UserErrorMessages,
  MESSAGES,
} from "../../utils/constants";
import { Roles, StatusCode } from "../../utils/enum";
import IOtpServices from "../../services/common/interfaces/IOTPService";
import { IOtpGenerate } from "../../types/types";
import { IJwtService } from "../../services/common/interfaces/IJWTService";
import { IEmail } from "../../types/email";
import { appLogger } from "../../utils/logger";
import { TokenPayload } from "../../types/dashboard-types";

export class UserController implements IUserController {
  private _userService: IUserService;
  private _otpService: IOtpServices;
  private _otpGenerator: IOtpGenerate;
  private _JWT: IJwtService;
  private _emailSender: IEmail;

  constructor(
    userService: IUserService,
    otpService: IOtpServices,
    otpGenerateService: IOtpGenerate,
    jwtService: IJwtService,
    emailService: IEmail,
  ) {
    this._userService = userService;
    this._otpService = otpService;
    this._otpGenerator = otpGenerateService;
    this._JWT = jwtService;
    this._emailSender = emailService;
  }

  async userSignUp(req: Request, res: Response): Promise<void> {
    try {
      let { email, password, username } = req.body;

      if (!email || !password || !username) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: `${MESSAGES.EMAIL_REQUIRED}, ${MESSAGES.PASSWORD_REQUIRED}, and ${MESSAGES.USERNAME_REQUIRED}`,
        });
        return;
      }

      const saltRound = 10;
      const hashedPassword = await bcrypt.hash(password, saltRound);
      password = hashedPassword;

      const existingUser = await this._userService.findByEmail(email);

      if (existingUser) {
        res.status(StatusCode.CONFLICT).json({
          success: false,
          message: MESSAGES.USER_ALREADY_EXISTS,
        });
        return;
      } else {
        const otp = await this._otpGenerator.createOtpDigit();

        // Create OTP with 60 seconds expiration
        const otpCreated = await this._otpService.createOtp(email, otp, 60);

        if (!otpCreated) {
          res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.FAILED_TO_CREATE_OTP,
          });
          return;
        }

        await this._emailSender.sentEmailVerification("User", email, otp);

        const token = await this._JWT.createToken({
          email,
          password,
          username,
          role: Roles.USER,
        });

        res.status(StatusCode.CREATED).json({
          success: true,
          message: MESSAGES.SIGNUP_SUCCESS,
          token,
        });
        return;
      }
    } catch (error) {
      appLogger.error("User SignUp Error:", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: SERVER_ERROR.INTERNAL_SERVER_ERROR,
        error:
          error instanceof Error ? error.message : SERVER_ERROR.UNKNOWN_ERROR,
      });
      return;
    }
  }

  async resendOtp(req: Request, res: Response): Promise<void> {
    try {
      let { email } = req.body;

      if (!email) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.EMAIL_REQUIRED,
        });
        return;
      }

      const existingOtp = await this._otpService.otpExists(email);
      if (existingOtp) {
        const remainingTime = await this._otpService.getOtpRemainingTime(email);
        appLogger.info(
          `Existing OTP found for ${email}, remaining time: ${remainingTime}`,
        );
      }

      const otp = await this._otpGenerator.createOtpDigit();
      const otpCreated = await this._otpService.createOtp(email, otp, 60);

      if (!otpCreated) {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: MESSAGES.FAILED_TO_CREATE_OTP,
        });
        return;
      }

      await this._emailSender.sentEmailVerification("User", email, otp);

      res.status(StatusCode.OK).json({
        success: true,
        message: MESSAGES.OTP_SENT,
      });
    } catch (error) {
      appLogger.error("Resend OTP Error:", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: SERVER_ERROR.INTERNAL_SERVER_ERROR,
        error:
          error instanceof Error ? error.message : SERVER_ERROR.UNKNOWN_ERROR,
      });
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { otp } = req.body;

      if (!otp) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.OTP_REQUIRED,
        });
        return;
      }

      const token = req.headers["the-verify-token"] || "";
      if (typeof token !== "string") {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: UserErrorMessages.TOKEN_INVALID,
        });
        return;
      }

      const decodeRaw = await this._JWT.verifyToken(token);

      if (typeof decodeRaw === "string") {
        res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: UserErrorMessages.TOKEN_INVALID,
        });
        return;
      }

      const decode = decodeRaw as TokenPayload;

      if (!decode || !decode.email) {
        res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: UserErrorMessages.TOKEN_INVALID,
        });
        return;
      }

      const isOtpValid = await this._otpService.verifyOtp(decode.email, otp);

      if (!isOtpValid) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.INCORRECT_OTP,
        });
        return;
      }

      const existingUser = await this._userService.findByEmail(decode.email);
      if (existingUser) {
        res.status(StatusCode.CONFLICT).json({
          success: false,
          message: MESSAGES.USER_ALREADY_EXISTS,
        });
        return;
      }

      const userData = {
        email: decode.email,
        password: decode.password,
        username: decode.username,
        role: decode.role || Roles.USER,
      };

      const user = await this._userService.createUser(userData as any);

      if (user) {
        const accessToken = await this._JWT.accessToken({
          id: user!._id.toString(),
          email: user.email,
          role: user.role ?? Roles.USER,
        });
        const refreshToken = await this._JWT.refreshToken({
          id: user!._id.toString(),
          email: user.email,
          role: user.role ?? Roles.USER,
        });

        const isProduction = process.env.NODE_ENV === "production";

        const cookieOptions = {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? ("none" as const) : ("lax" as const),
          maxAge: 7 * 24 * 60 * 60 * 1000,
        };

        res
          .status(StatusCode.CREATED)
          .cookie("accessToken", accessToken, cookieOptions)
          .cookie("refreshToken", refreshToken, cookieOptions)
          .json({
            success: true,
            message: MESSAGES.USER_CREATED,
            user: {
              id: user._id,
              email: user.email,
              username: user.username,
              role: user.role,
            },
          });
        return;
      } else {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: MESSAGES.FAILED_TO_CREATE_USER,
        });
        return;
      }
    } catch (error) {
      appLogger.error("Create User Error:", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: SERVER_ERROR.INTERNAL_SERVER_ERROR,
        error:
          error instanceof Error ? error.message : SERVER_ERROR.UNKNOWN_ERROR,
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: `${MESSAGES.EMAIL_REQUIRED} and ${MESSAGES.PASSWORD_REQUIRED}`,
        });
        return;
      }

      const user = await this._userService.findByEmail(email);

      if (!user) {
        res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: MESSAGES.USER_NOT_EXIST_WITH_THIS_EMAIL,
        });
        return;
      }

      if (user.isBlocked) {
        res.status(StatusCode.FORBIDDEN).json({
          success: false,
          message: MESSAGES.ACCOUNT_BLOCKED,
        });
        return;
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: MESSAGES.INVALID_PASSWORD,
        });
        return;
      }

      const role = user.role ?? Roles.USER;
      const id = user.id;

      const accessToken = await this._JWT.accessToken({ id, role, email });
      const refreshToken = await this._JWT.refreshToken({ id, role, email });

      const isProduction = process.env.NODE_ENV === "production";

      const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? ("none" as const) : ("lax" as const),
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      };

      res
        .status(StatusCode.OK)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json({
          success: true,
          message: MESSAGES.LOGIN_SUCCESS,
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
            isBlocked: user.isBlocked,
          },
        });
      return;
    } catch (error) {
      appLogger.error("Login Error:", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: SERVER_ERROR.INTERNAL_SERVER_ERROR,
        error:
          error instanceof Error ? error.message : SERVER_ERROR.UNKNOWN_ERROR,
      });
    }
  }

  async logout(_req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      res.status(StatusCode.OK).json({
        success: true,
        message: MESSAGES.LOGOUT_SUCCESS,
      });
    } catch (error) {
      appLogger.error("Logout Error:", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: SERVER_ERROR.INTERNAL_SERVER_ERROR,
        error:
          error instanceof Error ? error.message : SERVER_ERROR.UNKNOWN_ERROR,
      });
    }
  }

  async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      let { email } = req.body;

      if (!email) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.EMAIL_REQUIRED,
        });
        return;
      }

      const existingUser = await this._userService.findByEmail(email);

      if (existingUser) {
        const otp = await this._otpGenerator.createOtpDigit();

        const otpCreated = await this._otpService.createOtp(email, otp, 60);

        if (!otpCreated) {
          res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.FAILED_TO_CREATE_OTP,
          });
          return;
        }

        await this._emailSender.sentEmailVerification("User", email, otp);

        res.status(StatusCode.OK).json({
          success: true,
          message: MESSAGES.REDIERCTING_OTP_PAGE,
          data: {
            email: existingUser.email,
            username: existingUser.username,
          },
        });
      } else {
        res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: MESSAGES.USER_NOT_FOUND,
        });
      }
    } catch (error) {
      appLogger.error("Verify Email Error:", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: SERVER_ERROR.INTERNAL_SERVER_ERROR,
        error:
          error instanceof Error ? error.message : SERVER_ERROR.UNKNOWN_ERROR,
      });
    }
  }

  async verifyResetOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: `${MESSAGES.EMAIL_REQUIRED} and ${MESSAGES.OTP_REQUIRED}`,
        });
        return;
      }

      const isOtpValid = await this._otpService.verifyOtp(email, otp);

      if (isOtpValid) {
        let token = await this._JWT.createToken({ email });

        const isProduction = process.env.NODE_ENV === "production";

        const cookieOptions = {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? ("none" as const) : ("lax" as const),
          maxAge: 15 * 60 * 1000,
        };

        res
          .status(StatusCode.OK)
          .cookie("forgotToken", token, cookieOptions)
          .json({
            success: true,
            message: MESSAGES.REDIERCTING_PASSWORD_RESET_PAGE,
          });
      } else {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.INCORRECT_OTP,
        });
      }
    } catch (error) {
      appLogger.error("Verify Reset OTP Error:", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: SERVER_ERROR.INTERNAL_SERVER_ERROR,
        error:
          error instanceof Error ? error.message : SERVER_ERROR.UNKNOWN_ERROR,
      });
    }
  }

  async forgotResendOtp(req: Request, res: Response): Promise<void> {
    try {
      let { email } = req.body;

      if (!email) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.EMAIL_REQUIRED,
        });
        return;
      }

      let otp = await this._otpGenerator.createOtpDigit();
      const otpCreated = await this._otpService.createOtp(email, otp, 60);

      if (!otpCreated) {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: MESSAGES.FAILED_TO_CREATE_OTP,
        });
        return;
      }

      await this._emailSender.sentEmailVerification("User", email, otp);

      res.status(StatusCode.OK).json({
        success: true,
        message: MESSAGES.OTP_SENT,
      });
    } catch (error) {
      appLogger.error("Forgot Resend OTP Error:", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: SERVER_ERROR.INTERNAL_SERVER_ERROR,
        error:
          error instanceof Error ? error.message : SERVER_ERROR.UNKNOWN_ERROR,
      });
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { password } = req.body;
      if (!password) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.PASSWORD_REQUIRED,
        });
        return;
      }

      const token = req.cookies.forgotToken;

      if (!token) {
        res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: MESSAGES.RESET_TOKEN_REQUIRED,
        });
        return;
      }

      let data = await this._JWT.verifyToken(token);
      if (typeof data === "string") {
        res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: UserErrorMessages.TOKEN_INVALID,
        });
        return;
      }

      if (!data.email) {
        res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: UserErrorMessages.TOKEN_INVALID,
        });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const passwordReset = await this._userService.resetPassword(
        data.email,
        hashedPassword,
      );

      if (passwordReset) {
        res.clearCookie("forgotToken");
        res.status(StatusCode.OK).json({
          success: true,
          message: MESSAGES.PASSWORD_RESET,
        });
      } else {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: MESSAGES.FAILED_TO_RESET_PASSWORD,
        });
      }
    } catch (error) {
      appLogger.error("Reset Password Error:", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: SERVER_ERROR.INTERNAL_SERVER_ERROR,
        error:
          error instanceof Error ? error.message : SERVER_ERROR.UNKNOWN_ERROR,
      });
    }
  }

  async doGoogleLogin(req: Request, res: Response): Promise<void> {
    try {
      const { name, email } = req.body;

      if (!name || !email) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.NAME_REQUIRED,
        });
        return;
      }

      const existingUser = await this._userService.findByEmail(email);

      const isProduction = process.env.NODE_ENV === "production";

      const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? ("none" as const) : ("lax" as const),
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      };

      if (!existingUser) {
        const user = await this._userService.googleLogin(name, email);

        if (user) {
          const role = user.role ?? Roles.USER;
          const accessToken = await this._JWT.accessToken({
            id: user!._id.toString(),
            email,
            role,
          });
          const refreshToken = await this._JWT.refreshToken({
            id: user!._id.toString(),
            email,
            role,
          });

          res
            .status(StatusCode.OK)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json({
              success: true,
              message: MESSAGES.GOOGLE_LOGIN_SUCCESS,
              user: {
                id: user._id,
                email: user.email,
                username: user.username,
                role: user.role,
              },
            });
        }
      } else {
        if (!existingUser.isBlocked) {
          const role = existingUser.role ?? Roles.USER;
          const id = existingUser!._id.toString();
          const accessToken = await this._JWT.accessToken({ id, email, role });
          const refreshToken = await this._JWT.refreshToken({
            id,
            email,
            role,
          });

          res
            .status(StatusCode.OK)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json({
              success: true,
              message: MESSAGES.GOOGLE_LOGIN_SUCCESS,
              user: {
                id: existingUser._id,
                email: existingUser.email,
                username: existingUser.username,
                role: existingUser.role,
              },
            });
        } else {
          res.status(StatusCode.FORBIDDEN).json({
            success: false,
            message: MESSAGES.ACCOUNT_BLOCKED,
          });
        }
      }
    } catch (error) {
      appLogger.error("Google Login Error:", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: SERVER_ERROR.INTERNAL_SERVER_ERROR,
        error:
          error instanceof Error ? error.message : SERVER_ERROR.UNKNOWN_ERROR,
      });
    }
  }
}