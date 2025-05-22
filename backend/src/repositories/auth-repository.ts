import otpModel, { Iotp } from '../models/otp-model';
import IAuthRepository from './interfaces/IAuthRepository';

export class AuthRepository implements IAuthRepository {
  async createOtp(data: Partial<Iotp>): Promise<Iotp> {
    return await otpModel.create(data);
  }

  async findOtp(email: string, role: string): Promise<Iotp | null> {
    return await otpModel.findOne({ email, role }).exec();
  }

  async deleteOtp(email: string, role: string): Promise<void> {
    await otpModel.deleteOne({ email, role }).exec();
  }
}