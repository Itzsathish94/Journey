import { Iotp } from '../../models/otp-model';

export default interface IOtpRepository {
  createOtp(data: Partial<Iotp>): Promise<Iotp>;
  findOtp(email: string, role: string): Promise<Iotp | null>;
  verifyOtp(email: string, role: string, otp: string): Promise<boolean>;
  deleteOtp(email: string, role: string): Promise<void>;
}