import { IInterviewerProfileService } from "./interfaces/IInterviewerProfileService";
import { IInterviewerProfileRepository } from "../../repositories/interviewer-repository/interfaces/IInterviewerProfileRepository";
import { IInterviewer } from "../../models/interviewer-model";
import { InterviewerProfileDTO } from "../../models/interviewer-model";
import { toInterviewerProfileDTO } from "../../mappers/interviewer-mapper/interviewer-profile-mapper";
import { getPresignedUrl } from "../../utils/get-presigned-url";
import bcrypt from "bcrypt";

export class InterviewerProfileService implements IInterviewerProfileService {
  private _interviewerProfileRepo: IInterviewerProfileRepository;

  constructor(interviewerProfileRepo: IInterviewerProfileRepository) {
    this._interviewerProfileRepo = interviewerProfileRepo;
  }

  async getProfile(email: string): Promise<InterviewerProfileDTO | null> {
    const interviewer = await this._interviewerProfileRepo.getByEmail(email);

    if (!interviewer) {
      return null;
    }

    const profilePicUrl = interviewer.profilePicUrl
      ? await getPresignedUrl(interviewer.profilePicUrl)
      : undefined;

    return toInterviewerProfileDTO(interviewer, profilePicUrl);
  }

  async updateProfile(
    id: string,
    data: Partial<IInterviewer>,
  ): Promise<InterviewerProfileDTO | null> {
    const updatedInterviewer = await this._interviewerProfileRepo.updateProfile(
      id,
      data,
    );

    if (!updatedInterviewer) {
      return null;
    }

    const profilePicUrl = updatedInterviewer.profilePicUrl
      ? await getPresignedUrl(updatedInterviewer.profilePicUrl)
      : undefined;

    return toInterviewerProfileDTO(updatedInterviewer, profilePicUrl);
  }

  async updatePassword(
    email: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    const interviewer = await this._interviewerProfileRepo.getByEmail(email);

    if (!interviewer) {
      return false;
    }

    const isMatch = await bcrypt.compare(currentPassword, interviewer.password);

    if (!isMatch) {
      return false;
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    const updated = await this._interviewerProfileRepo.updatePassword(
      email,
      hashed,
    );

    return !!updated;
  }

  async getInterviewerRaw(email: string): Promise<IInterviewer | null> {
    return await this._interviewerProfileRepo.getByEmail(email);
  }
}