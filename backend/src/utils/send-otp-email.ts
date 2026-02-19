// src/utils/send-otp-email.ts
import nodemailer from "nodemailer";
import { IEmail } from "../types/email";
import dotenv from "dotenv";

dotenv.config();

export class SendEmail implements IEmail {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log("✅ Email service initialized with Nodemailer");
  }

  async sentEmailVerification(name: string, email: string, verificationCode: string): Promise<any> {
    return await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "🌟 Welcome to ulearn - Verify Your Email 🌟",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; text-align: center; border-radius: 8px; background-color: #f7f7f7;">
          <div style="background-color: rgba(255, 255, 255, 0.9); padding: 20px; border-radius: 8px; display: inline-block; width: 80%; max-width: 600px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #4CAF50; margin-bottom: 10px;">Welcome to ulearn, ${name}!</h2>
            <p style="font-size: 1.1em; margin-bottom: 20px;">Please use the verification code below to complete your email verification:</p>
            <div style="margin: 20px 0; font-size: 1.5em; font-weight: bold; color: #4CAF50; background: #f0f0f0; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
              ${verificationCode}
            </div>
            <p>If you didn't request this, please ignore this email.</p>
            <br>
            <p>Thank you, ${name}</p>
            <p><strong>The Ulearn Team</strong></p>
          </div>
        </div>
      `,
    });
  }

  async sendRejectionEmail(name: string, email: string, reason: string): Promise<any> {
    return await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "📢 uLearn - Verification Request Rejected",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; background-color: #fef2f2; text-align: center;">
          <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; display: inline-block; width: 80%; max-width: 600px; box-shadow: 0 0 10px rgba(255, 0, 0, 0.2);">
            <h2 style="color: #e53935;">Verification Rejected</h2>
            <p>Dear ${name},</p>
            <p>Your Interviewer verification request has been <strong style="color: #e53935;">rejected</strong>.</p>
            <p><strong>Reason:</strong></p>
            <blockquote style="background-color: #ffe6e6; border-left: 4px solid #e53935; padding: 10px; margin: 20px 0; font-style: italic;">
              ${reason}
            </blockquote>
            <p>You are welcome to re-apply after addressing the issue.</p>
            <br>
            <p>Thank you,</p>
            <p><strong>The uLearn Team</strong></p>
          </div>
        </div>
      `,
    });
  }

  async sendVerificationSuccessEmail(name: string, email: string): Promise<any> {
    return await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "🎉 uLearn - Interviewer Verification Approved!",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; background-color: #e8f5e9; text-align: center;">
          <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; display: inline-block; width: 80%; max-width: 600px; box-shadow: 0 0 10px rgba(76, 175, 80, 0.2);">
            <h2 style="color: #4CAF50;">🎉 Congratulations ${name}!</h2>
            <p>Your Interviewer verification request has been <strong style="color: #4CAF50;">approved</strong>.</p>
            <p>You now have full access to the Interviewer dashboard.</p>
            <br>
            <p>Welcome aboard!</p>
            <p><strong>The uLearn Team</strong></p>
          </div>
        </div>
      `,
    });
  }

  async sendMembershipPurchaseEmail(name: string, email: string, planName: string, expiryDate: Date): Promise<any> {
    return await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `✅ uLearn - Membership Activated for "${planName}"`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 20px; text-align: center;">
          <div style="background-color: white; padding: 20px; border-radius: 10px; display: inline-block;">
            <h2 style="color: #4CAF50;">Membership Activated 🎉</h2>
            <p>Hello <strong>${name}</strong>,</p>
            <p>Your membership plan "<strong>${planName}</strong>" has been successfully activated.</p>
            <p><strong>Expiry Date:</strong> ${new Date(expiryDate).toLocaleDateString()}</p>
            <p>Thank you for being part of uLearn! 🚀</p>
          </div>
        </div>
      `,
    });
  }

  async sendMembershipExpiryReminder(name: string, email: string, expiryDate: Date): Promise<any> {
    return await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `⚠️ Membership Expiring Soon`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #fff3cd; padding: 20px; text-align: center;">
          <div style="background-color: white; padding: 20px; border-radius: 10px; display: inline-block;">
            <h2 style="color: #ff9800;">Reminder: Membership Expiring Soon</h2>
            <p>Hello <strong>${name}</strong>,</p>
            <p>Your membership is expiring on <strong>${new Date(expiryDate).toLocaleDateString()}</strong>.</p>
            <p>Please renew your membership to continue enjoying benefits.</p>
          </div>
        </div>
      `,
    });
  }

  async sendSlotBookingConfirmation(name: string, email: string, InterviewerName: string, date: string, startTime: string, endTime: string): Promise<any> {
    return await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "✅ Slot Booking Confirmed - uLearn",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #e8f5e9;">
          <div style="background-color: white; padding: 20px; border-radius: 8px;">
            <h2 style="color: #4CAF50;">Slot Booking Confirmed!</h2>
            <p>Hello <strong>${name}</strong>,</p>
            <p>Your session with <strong>${InterviewerName}</strong> has been successfully booked.</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Start Time:</strong> ${startTime}</p>
            <p><strong>End Time:</strong> ${endTime}</p>
            <p>We look forward to your session!</p>
            <p>– uLearn Team</p>
          </div>
        </div>
      `,
    });
  }
}