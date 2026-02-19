import { Types } from "mongoose";
import { IInterviewer } from "../../models/interviewer-model";
import IInterviewerRepository from "../../repositories/interviewer-repository/interfaces/IInterviewerRepository";
import IInterviewerService from "./interfaces/IInterviewerService";

export default class InterviewerService implements IInterviewerService {
  private _interviewerRepository: IInterviewerRepository;

  constructor(insterviewerRepository: IInterviewerRepository) {
    this._interviewerRepository = insterviewerRepository;
  }

  async findByEmail(email: string): Promise<IInterviewer | null> {
    return this._interviewerRepository.findByEmail(email);
  }

  async findById(userId: string | Types.ObjectId): Promise<IInterviewer | null> {
  const id = typeof userId === "string" ? userId : userId.toString();
  return await this._interviewerRepository.findById(id);
}


  async createUser(userData: IInterviewer): Promise<IInterviewer | null> {
    return this._interviewerRepository.createUser(userData);
  }

  async resetPassword(
    email: string,
    password: string,
  ): Promise<IInterviewer | null> {
    return this._interviewerRepository.resetPassword(email, password);
  }

  async googleLogin(name: string, email: string): Promise<IInterviewer | null> {
    return this._interviewerRepository.googleLogin(name, email);
  }

  async setInterviewerVerified(email: string): Promise<IInterviewer | null> {
    return this._interviewerRepository.updateByEmail(email, {
      isVerified: true,
    });
  }
}