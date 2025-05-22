import otpModel, { Iotp } from '../models/otp-model';
import IOtpRepository from './interfaces/IOtpRepository';
import { GenericRepository } from './generic-repository';
import { OtpResponses } from '../utils/constants/messages/messages';

export class OtpRespository extends GenericRepository<Iotp> implements IOtpRepository {
  constructor() {
    super(otpModel);
  }

  async createOtp(data: Partial<Iotp>): Promise<Iotp> {
    try {
      const existingOtp = await this.findOne({ email: data.email, role: data.role });
      if (existingOtp) {
        return await this.updateOne(
          { email: data.email, role: data.role },
          {
            ...data,
            resendCount: existingOtp.resendCount + 1,
            lastResendAt: new Date(),
            failedAttempts: 0,
            lockedOutUntil: null,
          },
        ) as Iotp;
      }
      return await this.create({ ...data, failedAttempts: 0, resendCount: 0 });
    } catch (error) {
      throw error;
    }
  }

  async findOtp(email: string, role: string): Promise<Iotp | null> {
    try {
      return await this.findOne({ email, role });
    } catch (error) {
      throw error;
    }
  }

  async verifyOtp(email: string, role: string, otp: string): Promise<boolean> {
    try {
      const otpRecord = await this.findOne({ email, role });
      if (!otpRecord) {
        return false;
      }
      if (otpRecord.lockedOutUntil && otpRecord.lockedOutUntil > new Date()) {
        return false;
      }
      if (otpRecord.otp !== otp) {
        const updatedAttempts = otpRecord.failedAttempts + 1;
        const update: Partial<Iotp> = { failedAttempts: updatedAttempts };
        if (updatedAttempts >= 5) {
          update.lockedOutUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes
        }
        await this.updateOne({ email, role }, update);
        return false;
      }
      return true;
    } catch (error) {
      throw error;
    }
  }

  async deleteOtp(email: string, role: string): Promise<void> {
    try {
      await this.deleteOne({ email, role });
    } catch (error) {
      throw error;
    }
  }
}