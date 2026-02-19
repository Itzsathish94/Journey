import InterviewerModel, {
    IInterviewer,
    IInterviewerDTO,
  } from "../../models/interviewer-model";
  import { GenericRepository } from "../generic-repository";
  import IInterviewerRepository from "./interfaces/IInterviewerRepository";
  import { InterviewerErrorMessages } from "../../utils/constants";
  import bcrypt from "bcryptjs";
  export default class InterviewerRepository
    extends GenericRepository<IInterviewer>
    implements IInterviewerRepository
  {
    constructor() {
      super(InterviewerModel);
    }
  
    async findByEmail(email: string): Promise<IInterviewer | null> {
      return await this.findOne({ email });
    }
  
    async createUser(userData: IInterviewerDTO): Promise<IInterviewer | null> {
      return await this.create(userData);
    }
  
    async resetPassword(
      email: string,
      password: string,
    ): Promise<IInterviewer | null> {
      try {
        const interviewer = await this.findOne({ email });
  
        if (!interviewer) {
          throw new Error(InterviewerErrorMessages.USER_NOT_FOUND);
        }
  
        const interviewerId = interviewer._id as unknown as string;
  
        return await this.update(interviewerId, { password });
      } catch (error) {
        throw error;
      }
    }
  
    async googleLogin(name: string, email: string): Promise<IInterviewer| null> {
      try {
        const interviewer = await this.findByEmail(email);
  
        const username = name;
  
        if (!interviewer) {
          const tempPassword =
            Date.now().toString() + Math.floor(Math.random() * 10000).toString();
  
          const hashedPassword = await bcrypt.hash(tempPassword, 10);
  
          const newInterviewer = await this.createUser({
            username,
            email,
            password: hashedPassword,
          });
  
          return newInterviewer;
        }
  
        return interviewer;
      } catch (error) {
        throw error;
      }
    }
  
    async updateByEmail(
      email: string,
      data: Partial<IInterviewer>,
    ): Promise<IInterviewer | null> {
      return await this.updateOne({ email }, data);
    }
  
    //enroll
    async findById(id: string): Promise<IInterviewer | null> {
      return await super.findById(id);
    }
  
    async getinterviewerCount(): Promise<number> {
      return await this.countDocuments({ isinterviewer: true });
    }
  
    async getInterviewerCount(): Promise<number> {
      return await this.countDocuments({ isVerified: true });
    }
  }