import { Iotp } from '../../models/otp-model';

export default interface IAuthRepository {
  createOtp(data: Partial<Iotp>): Promise<Iotp>;
  findOtp(email: string, role: string): Promise<Iotp | null>;
  deleteOtp(email: string, role: string): Promise<void>;
}