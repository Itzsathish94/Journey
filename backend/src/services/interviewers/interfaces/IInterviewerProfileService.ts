import { IInterviewer } from "../../../models/interviewer-model";
import { InterviewerProfileDTO } from "../../../dto/interviewer-dto/interviewer-profile-dto";

export interface IInterviewerProfileService {
  getProfile(email: string): Promise<InterviewerProfileDTO | null>;
  updateProfile(
    id: string,
    data: Partial<IInterviewer>,
  ): Promise<InterviewerProfileDTO | null>;
  updatePassword(
    email: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<boolean>;
  getInterviewerRaw(email: string): Promise<IInterviewer | null>;
}