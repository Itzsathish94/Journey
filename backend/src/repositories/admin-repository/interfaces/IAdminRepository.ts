import { IUser } from "../../../models/user-model";
import { IAdmin } from "../../../models/admin-model";
import { IInterviewer } from "../../../models/interviewer-model";
import { BlockUpdate } from "../../../types/admin-types";

export interface IAdminRepository {
  //admin login
  getAdmin(email: string): Promise<IAdmin | null>;
  createAdmin(adminData: IAdmin): Promise<IAdmin | null>;

  //fetch users and Interviewers
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

  //get data based on email
  getUserData(email: string): Promise<IUser | null>;
  getInterviewerData(email: string): Promise<IInterviewer | null>;

  //block and ublock
  updateProfile(email: String, data: BlockUpdate): Promise<IUser | null>;
  updateInterviewerProfile(
    email: string,
    data: BlockUpdate,
  ): Promise<IInterviewer | null>;
}