// src/services/common/jwt-service.ts
import jwt, { SignOptions } from 'jsonwebtoken';
import { IJwtService } from './interfaces/IJWTService';
import { UserPayload, SignupPayload } from '../../types/types';
import { EnvError, JwtError } from '../../utils/constants';

interface DecodedPayload extends UserPayload {
  exp?: number;
  iat?: number;
}

export class JwtService implements IJwtService {
  async createToken(payload: Partial<UserPayload> | SignupPayload): Promise<string> {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error(EnvError.JWT_SECRET_NOT_FOUND);
    return jwt.sign(payload, secret, { expiresIn: '1d' });
  }

  async accessToken(payload: UserPayload, options?: SignOptions): Promise<string> {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error(EnvError.JWT_SECRET_NOT_FOUND);
    const { exp, iat, ...cleanPayload } = payload as DecodedPayload;
    return jwt.sign(cleanPayload, secret, { expiresIn: options?.expiresIn || '15m' });
  }

  async refreshToken(payload: UserPayload, options?: SignOptions): Promise<string> {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error(EnvError.JWT_SECRET_NOT_FOUND);
    const { exp, iat, ...cleanPayload } = payload as DecodedPayload;
    return jwt.sign(cleanPayload, secret, { expiresIn: options?.expiresIn || '7d' });
  }

  async verifyToken(token: string): Promise<UserPayload> {
    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) throw new Error(EnvError.JWT_SECRET_NOT_FOUND);
      if (!token) throw new Error(JwtError.JWT_NOT_FOUND);
      const decoded = jwt.verify(token, secret) as DecodedPayload;
      const { exp, iat, ...userPayload } = decoded;
      return userPayload;
    } catch (error: any) {
      console.error(`[JwtService] Token verification failed: ${error.message}`);
      throw new Error(JwtError.INVALID_JWT);
    }
  }
}