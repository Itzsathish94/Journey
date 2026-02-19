import InterviewerModel, { IInterviewer } from "../../models/interviewer-model";
import { GenericRepository } from "../generic-repository";
import { IAdminInterviewerRepository } from "./interfaces/IAdminInterviewerRepository";

export class AdminInterviewerRespository
  extends GenericRepository<IInterviewer>
  implements IAdminInterviewerRepository
{
  constructor() {
    super(InterviewerModel);
  }

  async getAllInterviewers(
    page: number,
    limit: number,
    search: string,
  ): Promise<{ interviewers: IInterviewer[]; total: number }> {
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

  async getInterviewerData(email: string): Promise<IInterviewer | null> {
    try {
      const InterviewerData = await this.findOne({ email: email });
      return InterviewerData;
    } catch (error) {
      throw error;
    }
  }

  //block or unblock

  async updateInterviewerProfile(email: string, data:Partial<IInterviewer>): Promise<IInterviewer | null> {
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

  async findById(id: string): Promise<IInterviewer | null> {
    try {
      return await this.model.findById(id).exec();
    } catch (error) {
      throw error;
    }
  }
}