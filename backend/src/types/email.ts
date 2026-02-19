import { SentMessageInfo } from "nodemailer";

export interface IEmail {
  sentEmailVerification(
    name: string,
    email: string,
    verification: string,
  ): Promise<SentMessageInfo>;

  sendRejectionEmail(
    name: string,
    email: string,
    reason: string,
  ): Promise<SentMessageInfo>;

  sendVerificationSuccessEmail(
    name: string,
    email: string,
  ): Promise<SentMessageInfo>;

}

export interface IForgotEmail {
  sendEmailVerification(email: string, verification: string): Promise<boolean>;
}