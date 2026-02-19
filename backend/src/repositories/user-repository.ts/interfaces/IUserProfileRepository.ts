
import { IUser } from "../../../models/user-model";

export interface IUserProfileRepository {
  getByEmail(email: string): Promise<IUser | null>;
  updateProfile(id: string, data: Partial<IUser>): Promise<IUser | null>;
  updatePassword(email: string, hashedPassword: string): Promise<IUser | null>;
}
