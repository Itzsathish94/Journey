import InterviewerModel, {
  IInterviewerModel,
} from "../../models/interviewer-model";
import { GenericRepository } from "../generic-repository";
import IInterviewerRepository from "./interfaces/IInterviewerRepository";

export default class InterviewerRepository
  extends GenericRepository<IInterviewerModel>
  implements IInterviewerRepository
{
  constructor() {
    super(InterviewerModel);
  }

  async findByEmail(email: string): Promise<IInterviewerModel | null> {
    return await this.findOne({ email });
  }

  async findByEmailWithPassword(email: string): Promise<IInterviewerModel | null> {
    return await this.model.findOne({ email }).select("+password").exec();
  }

  async createInterviewer(
    interviewerData: Partial<IInterviewerModel>,
  ): Promise<IInterviewerModel> {
    return await this.create(interviewerData);
  }

  async updatePasswordByEmail(
    email: string,
    hashedPassword: string,
  ): Promise<IInterviewerModel | null> {
    return await this.model
      .findOneAndUpdate(
        { email },
        { $set: { password: hashedPassword } },
        { new: true, runValidators: true },
      )
      .exec();
  }

  async findOrCreateByGoogle(name: string, email: string): Promise<IInterviewerModel> {
    let interviewer = await this.findByEmail(email);

    if (!interviewer) {
      interviewer = await this.createInterviewer({
        username: name,
        email,
        // No password needed for Google
        role: "INTERVIEWER",
        isVerified: true,
      });
    }

    return interviewer;
  }

  async updateByEmail(
    email: string,
    data: Partial<IInterviewerModel>,
  ): Promise<IInterviewerModel | null> {
    return await this.model.findOneAndUpdate(
      { email },
      { $set: data },
      { new: true, runValidators: true }
    );
  }

  async getInterviewerCount(): Promise<number> {
    return await this.countDocuments({ isVerified: true });
  }
}