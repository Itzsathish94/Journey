import { otpGenerateI } from "../types/types";

export class OtpGenerate implements otpGenerateI {
  async createOtpDigit(): Promise<string> {
    const digits = "0123456789";
    let OTP = "";
    const len = digits.length;

    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * len);
      OTP += digits[randomIndex];
    }
    console.log(`OTP:===>${OTP}`);
    return OTP;
  }
}