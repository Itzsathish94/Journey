import { IAdminService } from "./interfaces/IAdminService";
import { IAdmin } from "../../models/admin-model";
import { IAdminRepository } from "../../repositories/admin-repository/interfaces/IAdminRepository";
import { IInterviewer } from "../../models/interviewer-model";
import { IUser } from "../../models/user-model";
import { toUserListDTOs } from "../../mappers/admin-mappers/user-list-mapper";
import { mapInterviewersToDTO } from "../../mappers/admin-mappers/interviewer-list-mapper";
import { UserListDTO } from "../../dto/admin-dto/user-list-dto";
import { InterviewerDTO } from "../../dto/admin-dto/interviewer-list-dto";
import { BlockUpdate } from "../../types/admin-types";

export class AdminService implements IAdminService {
  private _adminRepository: IAdminRepository;

  constructor(adminRepository: IAdminRepository) {
    this._adminRepository = adminRepository;
  }

  async getAdminData(email: string): Promise<IAdmin | null> {
    return await this._adminRepository.getAdmin(email);
  }

  async createAdmin(adminData: IAdmin): Promise<IAdmin | null> {
    return await this._adminRepository.createAdmin(adminData);
  }

  async getAllUsers(
    page: number,
    limit: number,
    search: string,
  ): Promise<{ users: UserListDTO[]; total: number }> {
    const { users, total } = await this._adminRepository.getAllUsers(
      page,
      limit,
      search,
    );
    const userDTOs = toUserListDTOs(users);
    return { users: userDTOs, total };
  }

  async getAllInterviewers(
    page: number,
    limit: number,
    search: string,
  ): Promise<{ interviewers: InterviewerDTO[]; total: number }> {
    const { interviewers, total } =
      await this._adminRepository.getAllInterviewers(page, limit, search);
    const interviewerDTOs = mapInterviewersToDTO(interviewers);
    return { interviewers: interviewerDTOs, total };
  }

  async getUserData(email: string): Promise<IUser | null> {
    return this._adminRepository.getUserData(email);
  }

  async getInterviewerData(email: string): Promise<IInterviewer | null> {
    return await this._adminRepository.getInterviewerData(email);
  }

  async blockOrUnblockUser(email: string, data: BlockUpdate): Promise<IUser | null> {
    return await this._adminRepository.blockOrUnblockUser(email, data);
  }

  async blockOrUnblockInterviewer(
    email: string,
    data: BlockUpdate,
  ): Promise<IInterviewer | null> {
    return await this._adminRepository.blockOrUnblockInterviewer(email, data);
  }
}