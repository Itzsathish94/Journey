import { IUser } from "../../models/user-model";
import { UserProfileDTO } from "../../dto/user-dto/user-profile-dto";

export const toUserProfileDTO = (
  user: IUser,
  profilePicUrl?: string,
): UserProfileDTO => {
  return {
    username: user.username,
    email: user.email,
    profilePicUrl: profilePicUrl || user.profilePicUrl,
  };
};