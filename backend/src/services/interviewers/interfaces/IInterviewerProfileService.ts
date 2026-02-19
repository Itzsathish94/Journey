import { IInterviewer } from "../../../models/interviewer-model";
import { InterviewerProfileDTO } from "../../../models/interviewer-model";

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
  updateBankAccount(
    id: string,
    bankAccount: {
      accountHolderName?: string;
      accountNumber?: string;
      ifscCode?: string;
      bankName?: string;
    },
  ): Promise<InterviewerProfileDTO | null>;
  getInterviewerRaw(email: string): Promise<IInterviewer | null>;
}