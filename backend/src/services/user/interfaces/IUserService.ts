import { Types } from "mongoose";
import { IUser } from "../../../models/user-model";

export default interface IUserService {
  findByEmail(email: string): Promise<IUser | null>;
   findById(userId: string | Types.ObjectId): Promise<IUser | null>;
  createUser(userData: IUser): Promise<IUser | null>;
  resetPassword(email: string, password: string): Promise<IUser | null>;
  googleLogin(name: string, email: string): Promise<IUser | null>;
}