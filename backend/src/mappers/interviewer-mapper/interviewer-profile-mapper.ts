import { IInterviewerModel, InterviewerProfileDTO } from "../../models/interviewer-model";

export const toInterviewerProfileDTO = (
  interviewer: IInterviewerModel,
  profilePicUrl?: string, // optional override
): InterviewerProfileDTO => {
  return {
    _id: interviewer._id,
    username: interviewer.username,
    email: interviewer.email,
    role: interviewer.role,
    isBlocked: interviewer.isBlocked,
    isVerified: interviewer.isVerified,
    profilePicUrl: profilePicUrl || interviewer.profilePicUrl,
    bio: interviewer.bio,
    currentDesignation: interviewer.currentDesignation,
    // high‑level tags shown on profile/cards (no offerings here)
    domains: interviewer.domains || [],
    skills: interviewer.skills || [],
    industries: interviewer.industries || [],
  };
};