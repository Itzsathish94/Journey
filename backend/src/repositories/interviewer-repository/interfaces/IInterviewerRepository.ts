import { IInterviewer } from "../../../models/interviewer-model";
import { IGenericRepository } from "../../../repositories/generic-repository";

export default interface IInterviewerRepository
  extends IGenericRepository<IInterviewer> {
  findByEmail(email: string): Promise<IInterviewer | null>;
  createUser(userData: IInterviewer): Promise<IInterviewer | null>;
  resetPassword(email: string, password: string): Promise<IInterviewer | null>;
  googleLogin(name: string, email: string): Promise<IInterviewer | null>;

  updateByEmail(
    email: string,
    data: Partial<IInterviewer>,
  ): Promise<IInterviewer | null>;

  //enrollment side use
  findById(id: string): Promise<IInterviewer | null>;

  //admin side
  getinterviewerCount(): Promise<number>;
  getInterviewerCount(): Promise<number>;
}