import { Iotp } from '../../models/otp-model';
import { Roles } from '../../utils/enum';

export default interface IOtpServices {
  createOtp(email: string, role: Roles, signupData?: any): Promise<string>;
  findOtp(email: string, role: Roles): Promise<Iotp | null>;
  verifyOtp(email: string, role: Roles, otp: string): Promise<boolean>;
  deleteOtp(email: string, role: Roles): Promise<void>;
}