import { IInterviewer } from "../../../models/interviewer-model";

export interface IInterviewerProfileRepository {
  getByEmail(email: string): Promise<IInterviewer | null>;
  updateProfile(
    id: string,
    data: Partial<IInterviewer>,
  ): Promise<IInterviewer | null>;
  updatePassword(
    email: string,
    hashedPassword: string,
  ): Promise<IInterviewer | null>;
}