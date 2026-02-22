import { Request, Response } from "express";
import { UserPayload } from "@/types/types";
import { IInterviewerProfileService } from "@/services/interviewers/interfaces/IInterviewerProfileService";
import { IInterviewerProfileController } from "./interfaces/IInterviewerProfileController";
import { uploadToS3Bucket } from "../../utils/s3Bucket";
import { StatusCode } from "../../utils/enum";
import {
  InterviewerErrorMessages,
  InterviewerSuccessMessages,
} from "../../utils/constants";
import { appLogger } from "../../utils/logger";
import { IInterviewer } from "../../models/interviewer-model";
import { Types } from "mongoose";

export class InterviewerProfileController
  implements IInterviewerProfileController
{
  private _profileService: IInterviewerProfileService;

  constructor(
    profileService: IInterviewerProfileService,
  ) {
    this._profileService = profileService;
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const decoded = (req.user as UserPayload | undefined)?.email;

      if (!decoded) {
        res
          .status(StatusCode.FORBIDDEN)
          .json({ messag: InterviewerErrorMessages.ACCESS_DENIED });
        return;
      }

      const interviewerProfile = await this._profileService.getProfile(
        decoded,
      );

      if (!interviewerProfile) {
        res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: InterviewerErrorMessages.UNAUTHORIZED,
        });
        return;
      }

      res.status(StatusCode.OK).json({
        success: true,
        message: InterviewerSuccessMessages.PROFILE_FETCHED,
        data: interviewerProfile,
      });
    } catch (err) {
      appLogger.error("profile error", err);
      res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: InterviewerErrorMessages.TOKEN_INVALID,
      });
    }
  }

  async updateProfile(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const token = req.cookies["accessToken"] as string | undefined;
      if (!token) {
        res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: InterviewerErrorMessages.TOKEN_INVALID,
        });
        return;
      }

      const payload = req.user as UserPayload | undefined;
      const userId = payload?.id;
      const email = payload?.email;

      if (!userId || !email) {
        res
          .status(StatusCode.FORBIDDEN)
          .json({ messag: InterviewerErrorMessages.ACCESS_DENIED });
        return;
      }

      const {
        username,
        bio,
        currentDesignation,
        domains,
        skills,
        industries,
      } = req.body as {
        username?: string;
        bio?: string;
        currentDesignation?: string;
        domains?: string | string[];
        skills?: string | string[];
        industries?: string | string[];
      };

      const file = req.file;
      let profilePicUrl: string | undefined;

      if (file) {
        profilePicUrl = await uploadToS3Bucket(
          {
            originalname: file.originalname,
            buffer: file.buffer,
            mimetype: file.mimetype,
          },
          "interviewers",
        );
      }

      const normalizeToStringArray = (
        value?: string | string[],
      ): string[] | undefined => {
        if (!value) return undefined;
        if (Array.isArray(value)) return value;
        try {
          const parsed = JSON.parse(value);
          return Array.isArray(parsed) ? parsed : undefined;
        } catch {
          return [value];
        }
      };

      const domainIds = normalizeToStringArray(domains);
      const skillIds = normalizeToStringArray(skills);
      const industryIds = normalizeToStringArray(industries);

      // Load current interviewer to enforce "only after verification" rule
      const interviewer = await this._profileService.getInterviewerRaw(email);

      const updateData: Partial<IInterviewer> = {};

      if (username?.trim()) {
        updateData.username = username.trim();
      }
      if (bio?.trim()) {
        updateData.bio = bio.trim();
      }
      if (currentDesignation?.trim()) {
        updateData.currentDesignation = currentDesignation.trim();
      }
      if (profilePicUrl) {
        updateData.profilePicUrl = profilePicUrl;
      }

      const toObjectIds = (ids?: string[]): Types.ObjectId[] | undefined => {
        if (!ids) return undefined;
      
        // If you want strict validation, throw instead of filtering
        const invalid = ids.filter((id) => !Types.ObjectId.isValid(id));
        if (invalid.length) {
          throw new Error(`Invalid ObjectId(s): ${invalid.join(", ")}`);
        }
      
        return ids.map((id) => new Types.ObjectId(id));
      };

      // Domain / skill / industry can only be set after admin verification
      if (interviewer?.isVerified) {
        const domainObjectIds = toObjectIds(domainIds);
        const skillObjectIds = toObjectIds(skillIds);
        const industryObjectIds = toObjectIds(industryIds);
      
        if (domainObjectIds) updateData.domains = domainObjectIds;
        if (skillObjectIds) updateData.skills = skillObjectIds;
        if (industryObjectIds) updateData.industries = industryObjectIds;
      }

      if (Object.keys(updateData).length === 0) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: InterviewerErrorMessages.NO_VALID_FIELDS_PROVIDED,
        });
        return;
      }

      const updatedProfile = await this._profileService.updateProfile(
        userId,
        updateData,
      );

      if (!updatedProfile) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: InterviewerErrorMessages.PROFILE_UPDATE_FAILED,
        });
        return;
      }

      res.status(StatusCode.OK).json({
        success: true,
        message: InterviewerSuccessMessages.PROFILE_UPDATED,
        data: updatedProfile,
      });
    } catch (err) {
      appLogger.error("error in updating profile", err);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: InterviewerErrorMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updatePassword(req: Request, res: Response): Promise<void> {
    try {
      const email = (req.user as UserPayload | undefined)?.email;

      if (!email) {
        res
          .status(StatusCode.FORBIDDEN)
          .json({ messag: InterviewerErrorMessages.ACCESS_DENIED });
        return;
      }

      const { currentPassword, newPassword } = req.body;

      const updated = await this._profileService.updatePassword(
        email,
        currentPassword,
        newPassword,
      );

      if (!updated) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: InterviewerErrorMessages.PASSWORD_UPDATE_FAILED,
        });
        return;
      }

      res.status(StatusCode.OK).json({
        success: true,
        message: InterviewerSuccessMessages.PASSWORD_UPDATED,
      });
    } catch (err) {
      appLogger.error("error in updating password", err);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: InterviewerErrorMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }
}