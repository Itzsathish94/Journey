import { Roles } from '../utils/enum';

export interface InterviewerProfile {
  username: string; 
  profilePicUrl: string;
}

export interface InterviewerStatus {
  isBlocked: boolean; 
}

export interface UserProfile {
  username: string; 
  profilePicUrl: string;
}

export interface UserStatus {
  isBlocked: boolean; 
}

export interface InterviewerSignup {
  name: string;
  email: string;
  password: string;
  mobile: string;
  totalExperience: number;
  designation: string;
  experienceCertificateURL?: string; 
}

export interface UserSignup {
  name: string;
  email: string;
  password: string;
  mobile?: string;
}

export interface otpGenerateI {
  createOtpDigit(length?: number): Promise<string>;
}

export interface IEmail {
  sentEmailVerification(name: string, email: string, verification: string): Promise<boolean>;
}

export interface UserPayload {
  _id: string;
  email: string;
  role: Roles;
  isVerified: boolean;
}

export interface IUserPayload {
  _id: string;
  email: string;
  role: Roles;
  isVerified: boolean;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface OTPSignupInput {
  email: string;
  otp: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  email: string;
  otp: string;
  newPassword: string;
}