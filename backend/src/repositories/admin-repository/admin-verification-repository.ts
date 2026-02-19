import { IVerificationModel } from "../../models/verification-model";
import { GenericRepository } from "../generic-repository";
import VerificationModel from "../../models/verification-model";
import { IAdminVerificationRepository } from "./interfaces/IAdminVerification";
import { InterviewerErrorMessages } from "../../utils/constants";
import { NotFoundError, InternalServerError } from "../../utils/error";
import type { SortOrder } from "mongoose";
import { appLogger } from "../../utils/logger";

export class AdminVerificationRepository
  extends GenericRepository<IVerificationModel>
  implements IAdminVerificationRepository
{
  constructor() {
    super(VerificationModel);
  }

  async getAllRequests(
    page: number,
    limit: number,
    search: string = "",
  ): Promise<{ data: IVerificationModel[]; total: number }> {
    try {
      const filter = search
        ? {
            $or: [
              { username: { $regex: new RegExp(search, "i") } },
              { email: { $regex: new RegExp(search, "i") } },
            ],
          }
        : {};

      const sort: Record<string, SortOrder> = { createdAt: -1 };

      return await this.paginate(filter, page, limit, sort);
    } catch (error) {
      appLogger.error("Error in getAllRequests repository", { error });
      throw new InternalServerError("Failed to fetch verification requests");
    }
  }

  async getRequestDataByEmail(
    email: string,
  ): Promise<IVerificationModel | null> {
    try {
      return await this.findOne({ email });
    } catch (error) {
      appLogger.error("Error in getRequestDataByEmail repository", { error });
      throw new InternalServerError("Failed to fetch verification request");
    }
  }

  async approveRequest(
    email: string,
    status: string,
    reason?: string,
  ): Promise<IVerificationModel | null> {
    try {
      const Interviewer = await this.findOne({ email });
      
      if (!Interviewer) {
        throw new NotFoundError(InterviewerErrorMessages.INTERVIEWER_NOT_FOUND);
      }

      const InterviewerId = Interviewer._id as unknown as string;

      const updateData: Partial<IVerificationModel> = {
        status,
        reviewedAt: new Date(),
        rejectionReason: status === "rejected" ? reason : undefined,
      };

      const updated = await this.update(InterviewerId, updateData);
      
      if (!updated) {
        throw new InternalServerError("Failed to update verification request");
      }

      return updated;
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof InternalServerError) {
        throw error;
      }
      appLogger.error("Error in approveRequest repository", { error });
      throw new InternalServerError("Failed to process verification request");
    }
  }
}