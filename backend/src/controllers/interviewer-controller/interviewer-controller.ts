import { Request, Response } from "express";
import bcrypt from "bcrypt";
import IInterviewerController from "./interfaces/IInterviewerController";
import IInterviewerService from "../../services/interviewers/interfaces/IInterviewerService";
import IOtpServices from "../../services/common/interfaces/IOTPService";
import { Roles, StatusCode } from "../../utils/enum";
import { INTERVIEWER_MESSAGES, SERVER_ERROR } from "../../utils/constants";
import { IJwtService } from "../../services/common/interfaces/IJWTService";
import { IEmail } from "../../types/email";
import { IOtpGenerate } from "../../types/types";
import {
  throwAppError,
  handleControllerError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
} from "../../utils/error-handler";
import { IInterviewer } from "../../models/interviewer-model";
import { JwtPayload } from "jsonwebtoken";
import { appLogger } from "../../utils/logger";

export class InterviewerController implements IInterviewerController {
  private _interviewerService: IInterviewerService;
  private _otpService: IOtpServices;
  private _otpGenerator: IOtpGenerate;
  private _jwt: IJwtService;
  private _emailSender: IEmail;

  constructor(
    interviewerService: IInterviewerService,
    otpService: IOtpServices,
    otpGenerateService: IOtpGenerate,
    jwtService: IJwtService,
    emailService: IEmail,
  ) {
    this._interviewerService = interviewerService;
    this._otpService = otpService;
    this._otpGenerator = otpGenerateService;
    this._jwt = jwtService;
    this._emailSender = emailService;
  }


  async signUp(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, username } = req.body as {
        email: string;
        password: string;
        username: string;
      };

      if (!email || !password || !username)
        throwAppError(BadRequestError, INTERVIEWER_MESSAGES.EMAIL_PASSWORD_USERNAME_REQUIRED);

      const existingInterviewer = await this._interviewerService.findByEmail(email);
      if (existingInterviewer) throwAppError(ConflictError, INTERVIEWER_MESSAGES.USER_ALREADY_EXISTS);

      const hashedPassword = await bcrypt.hash(password, 10);
      const otp = await this._otpGenerator.createOtpDigit();
      const otpCreated = await this._otpService.createOtp(email, otp, 60);
      if (!otpCreated) throwAppError(InternalServerError, INTERVIEWER_MESSAGES.FAILED_TO_CREATE_OTP);

      await this._emailSender.sentEmailVerification("Interviewer", email, otp);

      const token = await this._jwt.createToken({
        email,
        password: hashedPassword,
        username,
        role: Roles.INTERVIEWER,
      });

      res.status(StatusCode.CREATED).json({
        success: true,
        message: INTERVIEWER_MESSAGES.SIGNUP_SUCCESS,
        token,
      });
    } catch (error) {
      console.log(error)
      handleControllerError(error, res);
    }
  }

  async resendOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body as { email: string };
      if (!email) throwAppError(BadRequestError, INTERVIEWER_MESSAGES.EMAIL_REQUIRED);

      const otpExists = await this._otpService.otpExists(email);
      if (otpExists) {
        const remainingTime = await this._otpService.getOtpRemainingTime(email);
        if (remainingTime !== null)
          throwAppError(
            BadRequestError,
            INTERVIEWER_MESSAGES.WAIT_FOR_OTP.replace("{remainingTime}", remainingTime.toString())
          );
      }

      const otp = await this._otpGenerator.createOtpDigit();
      const otpCreated = await this._otpService.createOtp(email, otp, 60);
      if (!otpCreated) throwAppError(InternalServerError, INTERVIEWER_MESSAGES.FAILED_TO_CREATE_OTP);

      await this._emailSender.sentEmailVerification("Interviewer", email, otp);

      res.status(StatusCode.OK).json({ success: true, message: INTERVIEWER_MESSAGES.OTP_SENT });
    } catch (error) {
      handleControllerError(error, res);
    }
  }


async createUser(req: Request, res: Response): Promise<void> {
  try {
    const { otp } = req.body;

    if (!otp) {
      res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message: INTERVIEWER_MESSAGES.OTP_REQUIRED,
      });
      return;
    }

    const token = req.headers["the-verify-token"] || "";
    if (typeof token !== "string") {
      res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message: INTERVIEWER_MESSAGES.TOKEN_INVALID,
      });
      return;
    }

    const decodedRaw = await this._jwt.verifyToken(token);

    if (typeof decodedRaw === "string") {
      res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: INTERVIEWER_MESSAGES.TOKEN_INVALID,
      });
      return;
    }

    const decoded = decodedRaw as JwtPayload & {
      email?: string;
      password?: string;
      username?: string;
      role?: string;
    };

    if (!decoded || !decoded.email || !decoded.password || !decoded.username) {
      res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: INTERVIEWER_MESSAGES.TOKEN_INVALID,
      });
      return;
    }

    // Verify OTP
    const isOtpValid = await this._otpService.verifyOtp(decoded.email, otp);

    if (!isOtpValid) {
      res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message: INTERVIEWER_MESSAGES.INCORRECT_OTP,
      });
      return;
    }
    const existingUser = await this._interviewerService.findByEmail(decoded.email);
    if (existingUser) {
      res.status(StatusCode.CONFLICT).json({
        success: false,
        message: INTERVIEWER_MESSAGES.USER_ALREADY_EXISTS,
      });
      return;
    }

    const userData = {
      email: decoded.email,
      password: decoded.password,
      username: decoded.username,
      role: decoded.role || Roles.INTERVIEWER,
      isVerified: false,
      isBlocked: false,
    };

    const user = await this._interviewerService.createUser(userData as IInterviewer);

    if (user) {
      await this._otpService.deleteOtp(decoded.email);

      res.status(StatusCode.CREATED).json({
        success: true,
        message: INTERVIEWER_MESSAGES.INTERVIEWER_CREATED_SUCCESSFULLY,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          role: user.role,
          isVerified: user.isVerified,
        },
      });
      return;
    } else {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: INTERVIEWER_MESSAGES.FAILED_TO_CREATE_INTERVIEWER,
      });
      return;
    }
  } catch (error) {
    appLogger.error("Create Interviewer Error:", error);
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: SERVER_ERROR.INTERNAL_SERVER_ERROR,
      error: error instanceof Error ? error.message : SERVER_ERROR.UNKNOWN_ERROR,
    });
  }
}


async login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) throwAppError(BadRequestError, INTERVIEWER_MESSAGES.EMAIL_PASSWORD_USERNAME_REQUIRED);

    const interviewer = await this._interviewerService.findByEmail(email);
    
    if (!interviewer){
      throwAppError(NotFoundError, INTERVIEWER_MESSAGES.USER_NOT_FOUND);
      return;
    }
    if (interviewer.isBlocked) throwAppError(ForbiddenError, INTERVIEWER_MESSAGES.INTERVIEWER_BLOCKED);

    const valid = await bcrypt.compare(password, interviewer.password);
    if (!valid) throwAppError(UnauthorizedError, INTERVIEWER_MESSAGES.INVALID_CREDENTIALS);

    const accessToken = await this._jwt.accessToken({
      email,
      role: interviewer.role ?? Roles.INTERVIEWER,
      id: interviewer!._id.toString(),
    });
    const refreshToken = await this._jwt.refreshToken({
      email,
      role: interviewer.role ?? Roles.INTERVIEWER,
      id: interviewer!._id.toString(),
    });

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
        message: INTERVIEWER_MESSAGES.LOGIN_SUCCESS,
        user: {
          id: interviewer._id,
          email: interviewer.email,
          username: interviewer.username,
          role: interviewer.role,
          isBlocked: interviewer.isBlocked,
          isVerified: interviewer.isVerified,
        },
      });
  } catch (error) {
    handleControllerError(error, res);
  }
}

  async logout(_req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie("accessToken", { httpOnly: true });
      res.clearCookie("refreshToken", { httpOnly: true });
      res.status(StatusCode.OK).json({ success: true, message: INTERVIEWER_MESSAGES.LOGOUT_SUCCESS });
    } catch (error) {
      handleControllerError(error, res);
    }
  }

  async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body as { email: string };
      if (!email) throwAppError(BadRequestError, INTERVIEWER_MESSAGES.EMAIL_REQUIRED);

      const existing = await this._interviewerService.findByEmail(email);
      if (!existing){
        throwAppError(NotFoundError, INTERVIEWER_MESSAGES.USER_NOT_FOUND);
        return
      }

      const otp = await this._otpGenerator.createOtpDigit();
      const created = await this._otpService.createOtp(email, otp, 60);
      if (!created) throwAppError(InternalServerError, INTERVIEWER_MESSAGES.FAILED_TO_CREATE_OTP);

      await this._emailSender.sentEmailVerification("Interviewer", email, otp);

      res.status(StatusCode.OK).json({
        success: true,
        message: INTERVIEWER_MESSAGES.REDIERCTING_OTP_PAGE,
        data: { email: existing.email, username: existing.username },
      });
    } catch (error) {
      handleControllerError(error, res);
    }
  }

async verifyResetOtp(req: Request, res: Response): Promise<void> {
  try {
    const { email, otp } = req.body as { email: string; otp: string };
    if (!email || !otp)
      throwAppError(
        BadRequestError,
        `${INTERVIEWER_MESSAGES.EMAIL_REQUIRED} and ${INTERVIEWER_MESSAGES.OTP_REQUIRED}`
      );

    const valid = await this._otpService.verifyOtp(email, otp);
    if (!valid) throwAppError(BadRequestError, INTERVIEWER_MESSAGES.INCORRECT_OTP);

    const token = await this._jwt.createToken({ email });

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
      .json({ success: true, message: INTERVIEWER_MESSAGES.REDIERCTING_PASSWORD_RESET_PAGE });
  } catch (error) {
    handleControllerError(error, res);
  }
}


  async forgotResendOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body as { email: string };
      if (!email) throwAppError(BadRequestError, INTERVIEWER_MESSAGES.EMAIL_REQUIRED);

      const exists = await this._otpService.otpExists(email);
      if (exists) {
        const time = await this._otpService.getOtpRemainingTime(email);
        if (time !== null)
          throwAppError(
            BadRequestError,
            INTERVIEWER_MESSAGES.WAIT_FOR_OTP.replace("{remainingTime}", time.toString())
          );
      }

      const otp = await this._otpGenerator.createOtpDigit();
      const created = await this._otpService.createOtp(email, otp, 60);
      if (!created) throwAppError(InternalServerError, INTERVIEWER_MESSAGES.FAILED_TO_CREATE_OTP);

      await this._emailSender.sentEmailVerification("Interviewer", email, otp);
      res.status(StatusCode.OK).json({ success: true, message: INTERVIEWER_MESSAGES.OTP_SENT });
    } catch (error) {
      handleControllerError(error, res);
    }
  }
  
 async resetPassword(req: Request, res: Response): Promise<void> {
  try {
    const { password } = req.body as { password: string };
    if (!password) throwAppError(BadRequestError, INTERVIEWER_MESSAGES.PASSWORD_REQUIRED);

    const token = req.cookies.forgotToken;
    if (!token) throwAppError(UnauthorizedError, INTERVIEWER_MESSAGES.RESET_TOKEN_REQUIRED);

    const payloadRaw = await this._jwt.verifyToken(token);

    if (typeof payloadRaw === "string") {
      throwAppError(UnauthorizedError, INTERVIEWER_MESSAGES.TOKEN_INVALID);
    }

    const payload = payloadRaw as JwtPayload & { email?: string, id?: string };

    if (!payload.email) {
      throwAppError(UnauthorizedError, INTERVIEWER_MESSAGES.TOKEN_INVALID);
      return
    }

    const hashed = await bcrypt.hash(password, 10);
    const updated = await this._interviewerService.resetPassword(payload.email, hashed);
    if (!updated) throwAppError(InternalServerError, INTERVIEWER_MESSAGES.FAILED_TO_RESET_PASSWORD);

    await this._otpService.deleteOtp(payload.email);
    res.clearCookie("forgotToken", { httpOnly: true });
    res.status(StatusCode.OK).json({ success: true, message: INTERVIEWER_MESSAGES.PASSWORD_RESET });
  } catch (error) {
    handleControllerError(error, res);
  }
}


async doGoogleLogin(req: Request, res: Response): Promise<void> {
  try {
    const { name, email } = req.body as { name: string; email: string };
    if (!name || !email) throwAppError(BadRequestError, INTERVIEWER_MESSAGES.NAME_EMAIL_REQUIRED);

    const existing = await this._interviewerService.findByEmail(email);

    let interviewer: IInterviewer;

    if (!existing) {
      const newInterviewer = await this._interviewerService.googleLogin(name, email);
      if (!newInterviewer) {
        throwAppError(InternalServerError, INTERVIEWER_MESSAGES.GOOGLE_LOGIN_FAILED);
        return;
      }
      interviewer = newInterviewer;
    } else {
      if (existing.isBlocked) throwAppError(ForbiddenError, INTERVIEWER_MESSAGES.INTERVIEWER_BLOCKED);
      interviewer = existing;
    }

    const accessToken = await this._jwt.accessToken({
      email,
      id: interviewer!._id.toString(),
      role: interviewer.role ?? Roles.INTERVIEWER,
    });
    const refreshToken = await this._jwt.refreshToken({
      email,
      id: interviewer!._id.toString(),
      role: interviewer.role ?? Roles.INTERVIEWER,
    });

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
        message: INTERVIEWER_MESSAGES.GOOGLE_LOGIN_SUCCESS,
        interviewer: {
          id: interviewer._id,
          email: interviewer.email,
          username: interviewer.username,
          role: interviewer.role,
          isBlocked: interviewer.isBlocked,
          isVerified: interviewer.isVerified,
        },
      });
  } catch (error) {
    handleControllerError(error, res);
  }
}
  
}