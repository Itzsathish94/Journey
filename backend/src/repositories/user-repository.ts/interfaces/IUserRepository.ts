import { IUser } from "../../../models/user-model";
import { IGenericRepository } from "../../../repositories/generic-repository";

import { Types } from "mongoose";
export interface IUserRepository extends IGenericRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  createUser(userData: IUser): Promise<IUser | null>;
  resetPassword(email: string, password: string): Promise<IUser | null>;
  googleLogin(name: string, email: string): Promise<IUser | null>;
  findById(userId: string | Types.ObjectId): Promise<IUser | null>;
}

