import { IInterviewerModel } from "../../models/interviewer-model";
import {InterviewerProfileDTO} from "../../dto/interviewer-dto/interviewer-profile-dto"


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
    domains: interviewer.domains?.map((domain: any) => domain.name || domain) || [],
    skills: interviewer.skills?.map((skill: any) => skill.name || skill) || [],
    industries: interviewer.industries?.map((industry: any) => industry.name || industry) || [],
  };
};

