// src/services/common/interfaces/IJWTService.ts
import { SignOptions } from 'jsonwebtoken';
import { UserPayload, SignupPayload } from '../../../types/types';

export interface IJwtService {
  createToken(payload: Partial<UserPayload> | SignupPayload): Promise<string>; // ✅
  accessToken(payload: UserPayload, options?: SignOptions): Promise<string>;
  refreshToken(payload: UserPayload, options?: SignOptions): Promise<string>;
  verifyToken(token: string): Promise<UserPayload>;
}