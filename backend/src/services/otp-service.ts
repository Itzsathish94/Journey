import { Iotp } from '../models/otp-model';
import IOtpRepository from '../repositories/interfaces/IOtpRepository';
import IOtpServices from './interfaces/IOtpService';
import { OtpGenerate } from '../utils/otp-generator';
import { Roles } from '../utils/enum';

export class OtpService implements IOtpServices {
  private otpRepository: IOtpRepository;
  private otpGenerator: OtpGenerate;

  constructor(otpRepository: IOtpRepository) {
    this.otpRepository = otpRepository;
    this.otpGenerator = new OtpGenerate();
  }

  async createOtp(email: string, role: Roles, signupData?: any): Promise<string> {
    try {
      const otp = await this.otpGenerator.createOtpDigit();
      await this.otpRepository.createOtp({
        email,
        otp,
        role,
        signupData,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      });
      return otp;
    } catch (error) {
      throw error;
    }
  }

  async findOtp(email: string, role: Roles): Promise<Iotp | null> {
    try {
      return await this.otpRepository.findOtp(email, role);
    } catch (error) {
      throw error;
    }
  }

  async verifyOtp(email: string, role: Roles, otp: string): Promise<boolean> {
    try {
      return await this.otpRepository.verifyOtp(email, role, otp);
    } catch (error) {
      throw error;
    }
  }

  async deleteOtp(email: string, role: Roles): Promise<void> {
    try {
      await this.otpRepository.deleteOtp(email, role);
    } catch (error) {
      throw error;
    }
  }
}