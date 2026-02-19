
import { IUserProfileService } from "./interfaces/IUserProfileService";
import { IUserProfileRepository } from "../../repositories/user-repository.ts/interfaces/IUserProfileRepository";
import { IUser } from "../../models/user-model";
import { toUserProfileDTO } from "../../mappers/user-mappers/user-profile-mapper";
import { getPresignedUrl } from "../../utils/get-presigned-url";
import { UserProfileDTO } from "../../dto/user-dto/user-profile-dto";

export class UserProfileService implements IUserProfileService {
  private _userProfileRepository: IUserProfileRepository;

  constructor(userProfileRepository: IUserProfileRepository) {
    this._userProfileRepository = userProfileRepository;
  }

  async getProfile(email: string): Promise<UserProfileDTO | null> {
    const user = await this._userProfileRepository.getByEmail(email);
    if (!user) return null;

    const profilePicUrl = user.profilePicUrl
      ? await getPresignedUrl(user.profilePicUrl)
      : undefined;

    return toUserProfileDTO(user, profilePicUrl);
  }

  async updateProfile(
    id: string,
    data: Partial<IUser>,
  ): Promise<UserProfileDTO | null> {
    const updatedUser = await this._userProfileRepository.updateProfile(
      id,
      data,
    );
    if (!updatedUser) return null;

    const profilePicUrl = updatedUser.profilePicUrl
      ? await getPresignedUrl(updatedUser.profilePicUrl)
      : undefined;

    return toUserProfileDTO(updatedUser, profilePicUrl);
  }

  async updatePassword(email: string, password: string): Promise<boolean> {
    const updated = await this._userProfileRepository.updatePassword(
      email,
      password,
    );
    return !!updated;
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return await this._userProfileRepository.getByEmail(email);
  }
}