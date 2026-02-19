import { IUser } from "../../../models/user-model";
import { UserProfileDTO } from "../../../dto/user-dto/user-profile-dto";

export interface IUserProfileService {
  getProfile(email: string): Promise<UserProfileDTO | null>;
  updateProfile(
    id: string,
    data: Partial<IUser>,
  ): Promise<UserProfileDTO | null>;
  updatePassword(email: string, password: string): Promise<boolean>;
  getUserByEmail(email: string): Promise<IUser | null>;
}