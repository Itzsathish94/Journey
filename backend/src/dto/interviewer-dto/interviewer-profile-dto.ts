import {Types} from "mongoose";


export interface InterviewerProfileDTO {
  _id: Types.ObjectId;
  username: string;
  email: string;
  role: string;
  isBlocked: boolean;
  isVerified: boolean;
  profilePicUrl?: string;
  bio?: string;
  currentDesignation?: string;
  // high‑level tags used for cards & profile (no mock offerings here)
  domains: string[];
  skills: string[];
  industries: string[];
}



