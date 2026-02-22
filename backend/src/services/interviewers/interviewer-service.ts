import { Types } from "mongoose";
import { IInterviewer } from "../../models/interviewer-model";
import { IInterviewerModel } from "../../models/interviewer-model";
import {IInterviewerDTO} from "../../dto/interviewer-dto/interviewer-dto"
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

  async findByEmailWithPassword(email: string): Promise<IInterviewerModel | null> {
    return this._interviewerRepository.findByEmailWithPassword(email);
  }

  async findById(userId: string | Types.ObjectId): Promise<IInterviewer | null> {
  const id = typeof userId === "string" ? userId : userId.toString();
  return await this._interviewerRepository.findById(id);
}


async createUser(userData: IInterviewerDTO): Promise<IInterviewerModel> {
  return this._interviewerRepository.createInterviewer({
    username: userData.username,
    email: userData.email,
    password: userData.password,
    role: "INTERVIEWER",
    isVerified: userData.isVerified ?? false,
  });
}

  async resetPassword(
    email: string,
    password: string,
  ): Promise<IInterviewer | null> {
    return this._interviewerRepository.updatePasswordByEmail(email, password);
  }

  async googleLogin(name: string, email: string): Promise<IInterviewer | null> {
    return this._interviewerRepository.findOrCreateByGoogle(name, email);
  }

  async setInterviewerVerified(email: string): Promise<IInterviewer | null> {
    return this._interviewerRepository.updateByEmail(email, {
      isVerified: true,
    });
  }
}