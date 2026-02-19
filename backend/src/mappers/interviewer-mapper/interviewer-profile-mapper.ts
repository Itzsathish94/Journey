import { IInterviewer } from "../../models/interviewer-model";
import { InterviewerProfileDTO } from "../../models/interviewer-model";

export const toInterviewerProfileDTO = (
  interviewer: IInterviewer,
  profilePicUrl?: string,
): InterviewerProfileDTO => {
  return {
    _id: interviewer._id,
    interviewerName: interviewer.username,
    email: interviewer.email,
    role: interviewer.role,
    isBlocked: interviewer.isBlocked,
    skills: interviewer.skills,
    expertise: interviewer.expertise,
    status: interviewer.isVerified,
    bankAccountLinked: !!interviewer.bankAccount?.accountNumber,
    profilePicUrl,
  };
};