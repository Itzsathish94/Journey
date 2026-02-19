import { IAdminRepository } from "./interfaces/IAdminRepository";
import AdminModel, { IAdmin } from "../../models/admin-model";
import { GenericRepository } from "../generic-repository";
import { IUser } from "../../models/user-model";
import { IInterviewer } from "../../models/interviewer-model";
import { IAdminUserRepository } from "./interfaces/IAdminUserRepository";
import { IAdminInterviewerRepository } from "./interfaces/IAdminInterviewerRepository";

export class AdminRespository
  extends GenericRepository<IAdmin>
  implements IAdminRepository
{
  private _adminUserRepository: IAdminUserRepository;
  private _adminInterviewerRepository: IAdminInterviewerRepository;
  constructor(
    adminUserRepository: IAdminUserRepository,
    adminInterviewerRepository: IAdminInterviewerRepository,
  ) {
    super(AdminModel);
    this._adminUserRepository = adminUserRepository;
    this._adminInterviewerRepository = adminInterviewerRepository;
  }

  async getAdmin(email: string): Promise<IAdmin | null> {
    return await this.findOne({ email });
  }

  async createAdmin(adminData: IAdmin): Promise<IAdmin | null> {
    return await this.create(adminData);
  }

  async getAllUsers(
    page: number,
    limit: number,
    search: string,
  ): Promise<{ users: IUser[]; total: number }> {
    try {
      const users = await this._adminUserRepository.getAllUsers(
        page,
        limit,
        search,
      );
      return users;
    } catch (error) {
      throw error;
    }
  }

  async getAllInterviewers(
    page: number,
    limit: number,
    search: string,
  ): Promise<{ interviewers: IInterviewer[]; total: number }> {
    try {
      const interviewers =
        await this._adminInterviewerRepository.getAllInterviewers(
          page,
          limit,
          search,
        );
      return interviewers;
    } catch (error) {
      throw error;
    }
  }

  async getUserData(email: string) {
    try {
      const response = await this._adminUserRepository.getUserData(email);

      return response;
    } catch (error) {
      throw error;
    }
  }

  async getInterviewerData(email: string) {
    try {
      const response =
        await this._adminInterviewerRepository.getInterviewerData(email);

      return response;
    } catch (error) {
      throw error;
    }
  }

  //block or unblock

  async updateProfile(email: string, data: Partial<IUser>): Promise<IUser | null> {
    try {
      const response = await this._adminUserRepository.updateProfile(
        email,
        data,
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateInterviewerProfile(email: string, data: Partial<IInterviewer>): Promise<IInterviewer | null> {
    try {
      const response =
        await this._adminInterviewerRepository.updateInterviewerProfile(
          email,
          data,
        );
      return response;
    } catch (error) {
      throw error;
    }
  }
}