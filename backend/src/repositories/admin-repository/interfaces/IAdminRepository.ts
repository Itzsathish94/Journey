import { IUser } from "../../../models/user-model";
import { IAdmin } from "../../../models/admin-model";
import { IInterviewer } from "../../../models/interviewer-model";
import { BlockUpdate } from "../../../types/admin-types";

export interface IAdminRepository {
  getAdmin(email: string): Promise<IAdmin | null>;
  createAdmin(adminData: IAdmin): Promise<IAdmin | null>;
  getAllUsers(
    page: number,
    limit: number,
    search: string,
  ): Promise<{ users: IUser[]; total: number }>;
  getAllInterviewers(
    page: number,
    limit: number,
    search: string,
  ): Promise<{ interviewers: IInterviewer[]; total: number }>;
  getUserData(email: string): Promise<IUser | null>;
  getInterviewerData(email: string): Promise<IInterviewer | null>;
  blockOrUnblockUser(email: String, data: BlockUpdate): Promise<IUser | null>;
  blockOrUnblockInterviewer(
    email: string,
    data: BlockUpdate,
  ): Promise<IInterviewer | null>;
}