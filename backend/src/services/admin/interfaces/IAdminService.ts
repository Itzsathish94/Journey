import { IUser } from "../../../models/user-model";
import { IAdmin, IAdminDTO } from "../../../models/admin-model";
import { IInterviewer } from "../../../models/interviewer-model";
import { UserListDTO } from "../../../dto/admin-dto/user-list-dto";
import { InterviewerDTO } from "../../../dto/admin-dto/interviewer-list-dto";
import { BlockUpdate } from "../../../types/admin-types";

export interface IAdminService {
  getAdminData(email: string): Promise<IAdmin | null>;
  createAdmin(adminData: IAdminDTO): Promise<IAdmin | null>;

  getAllUsers(
    page: number,
    limit: number,
    search: string,
  ): Promise<{ users: UserListDTO[]; total: number }>;
  getAllInterviewers(
    page: number,
    limit: number,
    search: string,
  ): Promise<{ interviewers: InterviewerDTO[]; total: number }>;

  //specified data based on email
  getUserData(email: string): Promise<IUser | null>;
  getInterviewerData(email: string): Promise<IInterviewer | null>;

  //block or unblock
  updateProfile(email: string, data: BlockUpdate): Promise<IUser | null>;
  updateInterviewerProfile(
    email: string,
    data: BlockUpdate,
  ): Promise<IInterviewer | null>;
}