import { IUserProfileRepository } from "./interfaces/IUserProfileRepository";

import UserModel, { IUser } from "../../models/user-model";
import { GenericRepository } from "../generic-repository";

export class UserProfileRepository
  extends GenericRepository<IUser>
  implements IUserProfileRepository
{
  constructor() {
    super(UserModel);
  }

  async getByEmail(email: string): Promise<IUser | null> {
    return await this.findOne({ email });
  }

  async updateProfile(id: string, data: Partial<IUser>): Promise<IUser | null> {
    return await this.updateOne({ _id: id }, data);
  }

  async updatePassword(email: string, password: string): Promise<IUser | null> {
    return await this.updateOne({ email }, { password });
  }
}