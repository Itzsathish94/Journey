import { Types } from "mongoose";
import { IInterviewer } from "../../../models/interviewer-model";

export default interface IInterviewerService {
  findByEmail(email: string): Promise<IInterviewer | null>;
  createUser(userData: IInterviewer): Promise<IInterviewer | null>;
  resetPassword(email: string, password: string): Promise<IInterviewer | null>;
  googleLogin(name: string, email: string): Promise<IInterviewer | null>;
  findById(userId: string | Types.ObjectId): Promise<IInterviewer | null>;
  setInterviewerVerified(email: string): Promise<IInterviewer | null>;
}