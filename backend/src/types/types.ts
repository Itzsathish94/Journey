export interface IOtpGenerate {
  createOtpDigit(length?: number): Promise<string>;
}

export type updateRequestType = {
  username: string;
  degreeCertificateUrl: string;
  resumeUrl: string;
  status: string;
};

export interface IEmail {
  sentEmailVerification(name: string, email: string, verification: string): Promise<boolean>;
  sendForgotPasswordOTP(name: string, email: string, otp: string): Promise<boolean>;
}

export interface UserPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface SignupPayload {
  email: string;
  password: string;
  username: string;
  role: string;
}