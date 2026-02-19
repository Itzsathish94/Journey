import { Response } from "express";
import { IUserProfileService } from "../../services/user/interfaces/IUserProfileService";
import { IUserProfileController } from "./interfaces/IUserProfileController";
import { uploadToS3Bucket } from "../../utils/s3Bucket";
import { StatusCode } from "../../utils/enum";
import {
  UserSuccessMessages,
  UserErrorMessages,
} from "../../utils/constants";
import bcrypt from "bcrypt";
import { AuthenticatedRequest } from "../../middlewares/authenticated-routes";
import { appLogger } from "../../utils/logger";
import { IUser } from "../../models/user-model";

export class UserProfileController implements IUserProfileController {
  private _userProfileService: IUserProfileService;

  constructor(userProfileService: IUserProfileService) {
    this._userProfileService = userProfileService;
  }

  async getProfile(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    try {
      const email = req.user?.email;
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
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: UserErrorMessages.TOKEN_INVALID,
        });
        return;
      }

      const { username, skills, expertise, currentStatus } = req.body;

      let profilePicUrl;
      if (req.file) {
        profilePicUrl = await uploadToS3Bucket(req.file, "users");
      }

      const parsedSkills = skills ? JSON.parse(skills) : [];
      const parsedExpertise = expertise ? JSON.parse(expertise) : [];

      const updateData: Partial<IUser> = {
        ...(username && { username }),
        ...(parsedSkills && { skills: parsedSkills }),
        ...(parsedExpertise && { expertise: parsedExpertise }),
        ...(currentStatus && { currentStatus }),
        ...(profilePicUrl && { profilePicUrl }),
      };

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
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    try {
      const email = req.user?.email;
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