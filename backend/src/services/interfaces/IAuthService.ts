import { IUser, IUserDTO } from '../../models/user-model';
import { Roles } from '../../utils/enum';

export default interface IAuthServices {
  initiateSignup(userDTO: IUserDTO, role: Roles): Promise<string>;
  verifyOtpAndCreateUser(token: string, otp: string, role: Roles): Promise<IUser | null>;
  findByEmail(email: string, role: Roles): Promise<IUser | null>;
  login(email: string, password: string, role: Roles): Promise<any>;
  logout(refreshToken: string): Promise<void>;
  refreshAccessToken(refreshToken: string): Promise<string | null>;
  clearAllTokens(): Promise<void>;
}
