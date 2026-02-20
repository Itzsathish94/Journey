import InterviewerModel, { IInterviewerModel } from "../../models/interviewer-model";
import { GenericRepository } from "../generic-repository";
import { IAdminInterviewerRepository } from "./interfaces/IAdminInterviewerRepository";

export class AdminInterviewerRespository
  extends GenericRepository<IInterviewerModel>
  implements IAdminInterviewerRepository
{
  constructor() {
    super(InterviewerModel);
  }

  async getAllInterviewers(
    page: number,
    limit: number,
    search: string,
  ): Promise<{ interviewers: IInterviewerModel[]; total: number }> {
    try {
      const query = {
        $or: [
          { username: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };

      const total = await this.countDocuments(query);

      const result = await this.paginate(query, page, limit, { createdAt: -1 });

      return { interviewers: result.data, total };
    } catch (error) {
      throw error;
    }
  }

  //get specified data based on email

  async getInterviewerData(email: string): Promise<IInterviewerModel | null> {
    try {
      const InterviewerData = await this.findOne({ email: email });
      return InterviewerData;
    } catch (error) {
      throw error;
    }
  }

  //block or unblock

  async updateInterviewerProfile(email: string, data:Partial<IInterviewerModel>): Promise<IInterviewerModel | null> {
    try {
      const response = await this.findOneAndUpdate(
        { email },
        { $set: data },
        { new: true },
      );

      return response;
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<IInterviewerModel | null> {
    try {
      return await this.model.findById(id).exec();
    } catch (error) {
      throw error;
    }
  }
}