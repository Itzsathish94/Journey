import { Request, Response } from "express";
import { UserPayload } from "@/types/types";
import { IUserProfileService } from "../../services/user/interfaces/IUserProfileService";
import { IUserProfileController } from "./interfaces/IUserProfileController";
import { uploadToS3Bucket } from "../../utils/s3Bucket";
import { StatusCode } from "../../utils/enum";
import {
  UserSuccessMessages,
  UserErrorMessages,
} from "../../utils/constants";
import bcrypt from "bcrypt";
import { appLogger } from "../../utils/logger";
import { IUser } from "../../models/user-model";

export class UserProfileController implements IUserProfileController {
  private _userProfileService: IUserProfileService;

  constructor(userProfileService: IUserProfileService) {
    this._userProfileService = userProfileService;
  }

  async getProfile(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const email = (req.user as UserPayload | undefined)?.email;
      if (!email) {
        res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: UserErrorMessages.TOKEN_INVALID,
        });
        return;
      }

      const userDTO = await this._userProfileService.getProfile(email);

      if (!userDTO) {
        res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: UserErrorMessages.User_NOT_FOUND,
        });
        return;
      }

      res.status(StatusCode.OK).json({
        success: true,
        message: UserSuccessMessages.PROFILE_FETCHED,
        data: userDTO,
      });
    } catch (error) {
      appLogger.error("getProfile error:", error);
      res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: UserErrorMessages.TOKEN_INVALID,
      });
    }
  }

  async updateProfile(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const userId = (req.user as UserPayload | undefined)?.id;
      if (!userId) {
        res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: UserErrorMessages.TOKEN_INVALID,
        });
        return;
      }

      const { username } = req.body;

      let profilePicUrl;
      if (req.file) {
        profilePicUrl = await uploadToS3Bucket(req.file, "users");
      }

      const updateData: Partial<IUser> = {
        ...(username && { username }),
        ...(profilePicUrl && { profilePicUrl }),
      };

      if (Object.keys(updateData).length === 0) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: UserErrorMessages.PROFILE_UPDATE_FAILED,
        });
        return;
      }

      const updatedDTO = await this._userProfileService.updateProfile(
        userId,
        updateData,
      );

      if (!updatedDTO) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: UserErrorMessages.PROFILE_UPDATE_FAILED,
        });
        return;
      }

      res.status(StatusCode.OK).json({
        success: true,
        message: UserSuccessMessages.PROFILE_UPDATED,
        data: updatedDTO,
      });
    } catch (error) {
      appLogger.error("updateProfile error:", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: UserErrorMessages.INTERNAL_ERROR,
      });
    }
  }

  async updatePassword(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const email = (req.user as UserPayload | undefined)?.email;
      if (!email) {
        res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: UserErrorMessages.TOKEN_INVALID,
        });
        return;
      }

      const { currentPassword, newPassword } = req.body;
      const user = await this._userProfileService.getUserByEmail(email);

      if (!user) {
        res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: UserErrorMessages.User_NOT_FOUND,
        });
        return;
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: UserErrorMessages.CURRENT_PASSWORD_INCORRECT,
        });
        return;
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const isUpdated = await this._userProfileService.updatePassword(
        email,
        hashedPassword,
      );

      if (!isUpdated) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: UserErrorMessages.PASSWORD_UPDATE_FAILED,
        });
        return;
      }

      res.status(StatusCode.OK).json({
        success: true,
        message: UserSuccessMessages.PASSWORD_UPDATED,
      });
    } catch (error) {
      appLogger.error("updatePassword error:", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: UserErrorMessages.INTERNAL_ERROR,
      });
    }
  }
}