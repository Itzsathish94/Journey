import { Request, Response } from 'express';
import  IAuthController  from './interfaces/IAuthController';
import  IAuthServices  from '../services/interfaces/IAuthService';
import { IUserDTO } from '../models/user-model';
import { UserSuccess, UserError } from '../utils/constants/messages/messages';
import { Roles } from '../utils/enum';
import { statusCode } from '../utils/constants/messages/status.code';

export class AuthController implements IAuthController {
  private authServices: IAuthServices;

  constructor(authServices: IAuthServices) {
    this.authServices = authServices;
  }

  public async userSignUp(req: Request, res: Response): Promise<any> {
    try {
      const userDTO: IUserDTO = req.body;

      const existingUser = await this.authServices.findByEmail(userDTO.email, Roles.USER);
      if (existingUser) {
        console.log(`[AuthController] Signup failed: User already exists - ${userDTO.email}`);
        return res.json({
          success: false,
          message: UserError.USER_ALREADY_EXISTS,
          user: existingUser,
        });
      }

      const token = await this.authServices.initiateSignup(userDTO, Roles.USER);
      console.log(`[AuthController] Signup initiated for ${userDTO.email}, token: ${token}`);
      return res.status(statusCode.created).json({
        success: true,
        message: UserSuccess.OTP_SENT,
        token,
      });
    } catch (error: any) {
      console.error(`[AuthController] Signup error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  }

  public async createUser(req: Request, res: Response): Promise<any> {
    try {
      const { otp } = req.body;
      const token = req.headers['the-verify-token'] || '';
      if (typeof token !== 'string') {
        console.log(`[AuthController] OTP verification failed: Invalid token`);
        throw new Error(UserError.TOKEN_INVALID);
      }

      const user = await this.authServices.verifyOtpAndCreateUser(token, otp, Roles.USER);
      if (!user) {
        console.log(`[AuthController] OTP verification failed: Incorrect OTP`);
        return res.json({
          success: false,
          message: UserError.INCORRECT_OTP,
        });
      }
      console.log(`[AuthController] User creation successful: ${user.email}`);

      return res.status(statusCode.created).json({
        success: true,
        message: UserSuccess.USER_CREATED,
        user,
      });
    } catch (error: any) {
      console.error(`[AuthController] OTP verification error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  }

  public async login(req: Request, res: Response): Promise<any> {
    try {
      const { email, password } = req.body;

      const result = await this.authServices.login(email, password, Roles.USER);
      if (!result) {
        console.log(`[AuthController] Login failed: Invalid credentials for ${email}`);
        return res.json({
          success: false,
          message: UserError.INVALID_CREDENTIALS,
        });
      }

      const { user, accessToken, refreshToken } = result;
      if (user.isBlocked) {
        console.log(`[AuthController] Login failed: User blocked - ${email}`);
        return res.json({
          success: false,
          message: UserError.INTERNAL_SERVER_ERROR,
        });
      }

      console.log(`[AuthController] Login successful for ${email}`);
      console.log(`[AuthController] Access Token: ${accessToken}`);
      console.log(`[AuthController] Refresh Token: ${refreshToken}`);

      return res
        .status(statusCode.ok)
        .cookie('accessToken', accessToken, { httpOnly: true })
        .cookie('refreshToken', refreshToken, { httpOnly: true })
        .json({
          success: true,
          message: 'User Logged Successfully',
          user,
        });
    } catch (error: any) {
      console.error(`[AuthController] Login error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  }

  public async refreshAccessToken(req: Request, res: Response): Promise<any> {
    try {
      const refreshToken = req.cookies['refreshToken'];
      if (!refreshToken) {
        console.log(`[AuthController] Refresh token missing`);
        return res.status(statusCode.unauthorized).json({
          success: false,
          message: 'Refresh token missing',
        });
      }

      const newAccessToken = await this.authServices.refreshAccessToken(refreshToken);
      if (!newAccessToken) {
        console.log(`[AuthController] Invalid or expired refresh token`);
        return res.status(statusCode.unauthorized).json({
          success: false,
          message: 'Invalid or expired refresh token',
        });
      }

      console.log(`[AuthController] Access token refreshed for ${refreshToken}`);
      return res
        .status(statusCode.ok)
        .cookie('accessToken', newAccessToken, { httpOnly: true })
        .json({
          success: true,
          message: 'Access token refreshed',
          accessToken: newAccessToken,
        });
    } catch (error: any) {
      console.error(`[AuthController] Refresh token error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  }

  public async logout(req: Request, res: Response): Promise<any> {
    try {
      const refreshToken = req.cookies['refreshToken'];
      if (refreshToken) {
        await this.authServices.logout(refreshToken);
        console.log(`[AuthController] Logout successful`);
      } else {
        console.log(`[AuthController] Logout: No refresh token provided`);
      }

      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      return res.status(statusCode.ok).json({
        success: true,
        message: UserSuccess.LOGOUT_SUCCESS,
      });
    } catch (error: any) {
      console.error(`[AuthController] Logout error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  }

  public async clearAllTokens(req: Request, res: Response): Promise<any> {
    try {
      await this.authServices.clearAllTokens();
      console.log(`[AuthController] All refresh tokens cleared`);
      return res.status(statusCode.ok).json({
        success: true,
        message: 'All refresh tokens cleared',
      });
    } catch (error: any) {
      console.error(`[AuthController] Clear tokens error: ${error.message}`);
      return res.status(statusCode.internalServer).json({
        success: false,
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  }
}