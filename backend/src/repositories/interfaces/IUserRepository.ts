import { IUser } from "../../models/user-model";
import { IGenericRepository } from "../generic-repository";

export interface IUserRepository extends IGenericRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  createUser(userData: IUser): Promise<IUser | null>;
  resetPassword(email: string, password: string): Promise<IUser | null>;
  googleLogin(
    name: string,
    email: string,
    password: string
  ): Promise<IUser | null>;
  updateProfile(email: string, data: IUser): Promise<IUser | null>;
}