import { IInterviewerProfileRepository } from "./interfaces/IInterviewerProfileRepository";
import InterviewerModel, { IInterviewer } from "../../models/interviewer-model";
import { GenericRepository } from "../generic-repository";

export class InterviewerProfileRepository
  extends GenericRepository<IInterviewer>
  implements IInterviewerProfileRepository
{
  constructor() {
    super(InterviewerModel);
  }

  async getByEmail(email: string): Promise<IInterviewer | null> {
    return await this.findOne({ email });
  }

  async updateProfile(
    id: string,
    data: Partial<IInterviewer>,
  ): Promise<IInterviewer | null> {
    return await this.updateOne({ _id: id }, data);
  }

  async updatePassword(
    email: string,
    hashedPassword: string,
  ): Promise<IInterviewer | null> {
    return await this.updateOne({ email }, { password: hashedPassword });
  }
}