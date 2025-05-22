import nodemailer from 'nodemailer';
import { IEmail } from '../types/types';

export class EmailService implements IEmail {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sentEmailVerification(name: string, email: string, verification: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify Your Account',
        html: `
          <h1>Hello, ${name}</h1>
          <p>Your OTP for account verification is: <strong>${verification}</strong></p>
          <p>This OTP expires in 1 hour.</p>
        `,
      });
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  async sendForgotPasswordOTP(name: string, email: string, otp: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset OTP',
        html: `
          <h1>Hello, ${name}</h1>
          <p>Your OTP for password reset is: <strong>${otp}</strong></p>
          <p>This OTP expires in 1 hour.</p>
        `,
      });
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }
}