export interface UserProfileDTO {
    username: string;
    email: string;
    skills: string[];
    expertise: string[];
    profilePicUrl?: string;
    currentStatus?: string;
  }