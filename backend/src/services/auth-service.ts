import { IUserDTO, IUser } from '../models/user-model';
import IAuthServices from './interfaces/IAuthService';
import IUserService from './interfaces/IUserServices';
import IOtpService from './interfaces/IOtpService';
import IRefreshTokenServices from './interfaces/IRefreshTokenService';
import { JwtService } from '../utils/jwt';
import { Roles } from '../utils/enum';
import { UserPayload } from '../types/types';

export class AuthServices implements IAuthServices {
  private userServices: IUserService;
  private otpServices: IOtpService;
  private refreshTokenServices: IRefreshTokenServices;
  private jwtService: JwtService;

  constructor(
    userServices: IUserService,
    otpServices: IOtpService,
    refreshTokenServices: IRefreshTokenServices,
  ) {
    this.userServices = userServices;
    this.otpServices = otpServices;
    this.refreshTokenServices = refreshTokenServices;
    this.jwtService = new JwtService();
  }

  async initiateSignup(userDTO: IUserDTO, role: Roles): Promise<string> {
    if (!userDTO.email || !userDTO.name || !userDTO.password) {
      throw new Error('Missing required fields');
    }

    const otp = await this.otpServices.createOtp(userDTO.email, role, userDTO);
    console.log(`[AuthService] OTP generated for ${userDTO.email}: ${otp}`);
    const token = await this.jwtService.createToken({ email: userDTO.email, role });
    console.log(`[AuthService] Signup token created: ${token}`);
    return token;
  }

  async verifyOtpAndCreateUser(token: string, otp: string, role: Roles): Promise<IUser | null> {
    try {
      const decoded = await this.jwtService.verifyToken(token) as UserPayload;
      if (!decoded || decoded.role !== role) {
        console.log(`[AuthService] Token verification failed: Invalid role or token for ${token}`);
        throw new Error('Invalid token or role');
      }

      const isValid = await this.otpServices.verifyOtp(decoded.email, role, otp);
      if (!isValid) {
        console.log(`[AuthService] OTP verification failed for ${decoded.email}`);
        return null;
      }

      const otpRecord = await this.otpServices.findOtp(decoded.email, role);
      if (!otpRecord || !otpRecord.signupData) {
        console.log(`[AuthService] No OTP record found for ${decoded.email}`);
        return null;
      }

      const userData: IUserDTO = {
        name: otpRecord.signupData.name,
        email: otpRecord.signupData.email,
        password: otpRecord.signupData.password,
        mobile: otpRecord.signupData.mobile,
      };

      const user = await this.userServices.createUser(userData, role);
      console.log(`[AuthService] User created successfully: ${user.email}`);
      await this.otpServices.deleteOtp(decoded.email, role);
      return user;
    } catch (error:any) {
      console.error(`[AuthService] OTP verification error: ${error.message}`);
      throw error;
    }
  }

  async findByEmail(email: string, role: Roles): Promise<IUser | null> {
    const user = await this.userServices.findByEmail(email);
    if (user && user.role.toUpperCase() === role.toUpperCase()) {
      return user;
    }
    return null;
  }

  async login(email: string, password: string, role: Roles): Promise<any> {
    try {
      const user = await this.userServices.findByEmail(email);
      if (!user) {
        console.log(`[AuthService] User not found: ${email}`);
        return null;
      }

      const isPasswordValid = await user.comparePassword!(password);
      if (!isPasswordValid) {
        console.log(`[AuthService] Invalid password for ${email}`);
        return null;
      }

      if (user.role.toUpperCase() !== role.toUpperCase()) {
        console.log(`[AuthService] Role mismatch for ${email}: Expected ${role}, got ${user.role}`);
        return null;
      }

      const payload: UserPayload = {
        _id: user._id.toString(),
        email: user.email,
        role: user.role.toUpperCase() as Roles,
        isVerified: user.isVerified,
      };

      const accessToken = await this.jwtService.accessToken(payload);
      const refreshToken = await this.jwtService.refreshToken(payload);
      await this.refreshTokenServices.createToken(user._id.toString(), refreshToken);
      console.log(`[AuthService] Refresh token stored for ${email}: ${refreshToken}`);

      console.log(`[AuthService] Login successful for ${email}`);
      console.log(`[AuthService] Access Token: ${accessToken}`);
      console.log(`[AuthService] Refresh Token: ${refreshToken}`);

      return { user, accessToken, refreshToken };
    } catch (error: any) {
      console.error(`[AuthService] Login error: ${error.message}`);
      return null;
    }
  }

  async logout(refreshToken: string): Promise<void> {
    await this.refreshTokenServices.deleteToken(refreshToken);
    console.log(`[AuthService] Logout successful, refresh token deleted`);
  }

  async refreshAccessToken(refreshToken: string): Promise<string | null> {
    const payload = await this.jwtService.verifyToken(refreshToken) as UserPayload | null;
    if (!payload) {
      console.log(`[AuthService] Refresh token invalid`);
      return null;
    }
    const storedToken = await this.refreshTokenServices.findToken(refreshToken);
    if (!storedToken) {
      console.log(`[AuthService] Refresh token not found`);
      return null;
    }
    const newAccessToken = await this.jwtService.accessToken(payload);
    console.log(`[AuthService] New Access Token generated: ${newAccessToken}`);
    return newAccessToken;
  }

  async clearAllTokens(): Promise<void> {
    await this.refreshTokenServices.deleteToken('');
    console.log(`[AuthService] All refresh tokens cleared`);
  }
}