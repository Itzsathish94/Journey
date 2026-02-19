import { Request, Response } from "express";
import { IAdminController } from "./interfaces/IAdminController";
import { IAdminService } from "../../services/admin/interfaces/IAdminService";
import { config } from "dotenv";
import { Roles, StatusCode } from "../../utils/enum"
import {
  AdminErrorMessages,
  AdminSuccessMessages,
  ResponseError,
} from "../../utils/constants";
import { IJwtService } from "../../services/common/interfaces/IJWTService";
import { appLogger } from "../../utils/logger";
import { IHashService } from "../../services/common/interfaces/IHashService";

config();

export class AdminController implements IAdminController {
  private _adminService: IAdminService;
  private _JWT: IJwtService;
  private _hashService : IHashService

  constructor(adminService: IAdminService, jwtService: IJwtService,hashService:IHashService) {
    this._adminService = adminService;
    this._JWT = jwtService;
    this._hashService = hashService
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      appLogger.info('[ADMIN] Log in attempt....')
      const { email, password } = req.body;

      const admin = await this._adminService.getAdminData(email);
  
      if (!admin) {
        appLogger.info(`[Admin] not found...`)
        res.status(StatusCode.NOT_FOUND).send({
          success: false,
          message: AdminErrorMessages.ADMIN_NOT_FOUND,
        });
        return;
      }
  
      const isPasswordValid = await this._hashService.comparePassword(
        password,
        admin.password
      );
  
      if (!isPasswordValid) {
        appLogger.info('[Admin] password wrong')
        res.status(StatusCode.UNAUTHORIZED).send({
          success: false,
          message: AdminErrorMessages.PASSWORD_INCORRECT,
        });
        return;
      }
  
      const accessToken = await this._JWT.accessToken({
        email,
        role: Roles.ADMIN,
        id: admin._id.toString(),
      });
  
      const refreshToken = await this._JWT.refreshToken({
        email,
        role: Roles.ADMIN,
        id: admin._id.toString(),
      });
  
      const isProduction = process.env.NODE_ENV === "production";
      
      const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? ("none" as const) : ("lax" as const),
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      };
      
      appLogger.info('[Admin] logged in...')
      res
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .status(StatusCode.OK)
        .send({
          success: true,
          message: AdminSuccessMessages.LOGIN_SUCCESS,
          token: accessToken,
          data: {
            email,
            role: Roles.ADMIN,
            name: Roles.ADMIN,
            adminId: admin._id,
          },
        });
    } catch (error) {
      appLogger.error("Admin login error", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
        success: false,
        message: AdminErrorMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }


  async logout(_req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      appLogger.info('[Admin] logged out....')

      res.status(StatusCode.OK).send({
        success: true,
        message: AdminSuccessMessages.LOGOUT_SUCCESS,
      });
    } catch (error) {
      throw error;
    }
  }
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || "";

      const { users, total } = await this._adminService.getAllUsers(
        page,
        limit,
        search,
      );

      res.status(StatusCode.OK).json({
        success: true,
        message:
          users.length > 0
            ? ResponseError.FETCH_USER
            : ResponseError.USER_NOT_FOUND,
        users,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
      return
    } catch (error) {
      appLogger.error("Error fetching users:", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ResponseError.FETCH_ERROR,
      });
      return
    }
  }

  async getAllInterviewers(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;

      const { interviewers, total } = await this._adminService.getAllInterviewers(
        Number(page),
        Number(limit),
        String(search),
      );

      res.status(StatusCode.OK).json({
        success: true,
        message:
        interviewers.length > 0
            ? ResponseError.FETCH_INTERVIEWER
            : ResponseError.USERFETCHING_ERROR,
            interviewers,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
      });
      return
    } catch (error) {
      appLogger.error("Error fetching Interviewers:", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ResponseError.FETCH_ERROR,
      });
      return
    }
  }

  async blockUser(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;

      const userData = await this._adminService.getUserData(email);

      if (!userData) {
        res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: ResponseError.USER_NOT_FOUND,
        });
        return
      }

      const emailId = userData.email;
      const isBlocked = !userData?.isBlocked;

      const userStatus = await this._adminService.updateProfile(emailId, {
        isBlocked,
      });

      res.status(StatusCode.OK).json({
        success: true,
        message: userStatus?.isBlocked
          ? ResponseError.ACCOUNT_BLOCKED
          : ResponseError.ACCOUNT_UNBLOCKED,
      });
      return
    } catch (error) {
      appLogger.error("Error blocking user", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ResponseError.INTERNAL_SERVER_ERROR,
      });
      return
    }
  }

  async blockInterviewer(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;
      const userData = await this._adminService.getInterviewerData(email);

      if (!userData) {
        res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: ResponseError.NOT_FOUND,
        });
        return
      }

      const emailId = userData.email;
      const isBlocked = !userData?.isBlocked;

      const userStatus = await this._adminService.updateInterviewerProfile(
        emailId,
        { isBlocked },
      );

      res.status(StatusCode.OK).json({
        success: true,
        message: userStatus?.isBlocked
          ? ResponseError.ACCOUNT_BLOCKED
          : ResponseError.ACCOUNT_UNBLOCKED,
      });
      return
    } catch (error) {
      appLogger.error("Error blocking interviewer", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ResponseError.INTERNAL_SERVER_ERROR,
      });
      return
    }
  }
}