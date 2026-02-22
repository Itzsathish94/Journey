import { Types } from "mongoose";
import InterviewerModel, {
  IInterviewerModel,
  IMockOffering,
} from "../../models/interviewer-model";
import { GenericRepository } from "../generic-repository";
import { IInterviewerMockRepository } from "./interfaces/IInterviewerMockRepository";

export class InterviewerMockRepository
  extends GenericRepository<IInterviewerModel>
  implements IInterviewerMockRepository
{
  constructor() {
    super(InterviewerModel);
  }

  async addMockOffering(
    interviewerId: string,
    offering: Omit<IMockOffering, "_id">,
  ): Promise<IInterviewerModel | null> {
    return this.model
      .findByIdAndUpdate(
        interviewerId,
        { $push: { offerings: offering } },
        { new: true, runValidators: true },
      )
      .exec();
  }

  async getMockOfferings(interviewerId: string): Promise<IMockOffering[]> {
    const interviewer = await this.findById(interviewerId);
    return interviewer?.offerings || [];
  }

  async updateMockOffering(
    interviewerId: string,
    mockId: string,
    update: Partial<IMockOffering>,
    signature?: string,
  ): Promise<IInterviewerModel | null> {
    const set: Record<string, unknown> = {};
  
    if (update.domainId) set["offerings.$.domainId"] = update.domainId;
    if (update.skillIds) set["offerings.$.skillIds"] = update.skillIds;
    if (update.industryIds) set["offerings.$.industryIds"] = update.industryIds;
    if (update.difficultyLevels) set["offerings.$.difficultyLevels"] = update.difficultyLevels;
    if (typeof update.isActive === "boolean") set["offerings.$.isActive"] = update.isActive;
  
    // ✅ allow updating signature when combo changes
    if (signature) set["offerings.$.signature"] = signature;
  
    if (Object.keys(set).length === 0) {
      return this.model.findById(interviewerId).exec();
    }
  
    return this.model
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(interviewerId),
          "offerings._id": new Types.ObjectId(mockId),
        },
        { $set: set },
        { new: true, runValidators: true },
      )
      .exec();
  }

  async toggleMockActive(
    interviewerId: string,
    mockId: string,
    isActive: boolean,
  ): Promise<IInterviewerModel | null> {
    return await this.updateMockOffering(interviewerId, mockId, { isActive });
  }
}

