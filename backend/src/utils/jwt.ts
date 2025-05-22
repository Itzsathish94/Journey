import './loadEnv'
import jwt, { SignOptions } from 'jsonwebtoken';
import {EnvError,JwtError } from './constants/messages/messages';
import { UserPayload } from '../types/types';

interface DecodedPayload extends UserPayload {
  exp?: number;
  iat?: number;
}

export class JwtService {
  async createToken(payload: Partial<UserPayload>): Promise<string> {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error(EnvError.JWT_SECRET_NOT_FOUND);
    }
    // Remove exp and iat if present
    const { exp, iat, ...cleanPayload } = payload as DecodedPayload;
    return jwt.sign(cleanPayload, secret, { expiresIn: '1h' });
  }

  async accessToken(payload: UserPayload, options?: SignOptions): Promise<string> {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error(EnvError.JWT_SECRET_NOT_FOUND);
    }
    // Remove exp and iat if present
    const { exp, iat, ...cleanPayload } = payload as DecodedPayload;
    return jwt.sign(cleanPayload, secret, { expiresIn: options?.expiresIn || '15m' });
  }

  async refreshToken(payload: UserPayload, options?: SignOptions): Promise<string> {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error(EnvError.JWT_SECRET_NOT_FOUND);
    }
    // Remove exp and iat if present
    const { exp, iat, ...cleanPayload } = payload as DecodedPayload;
    return jwt.sign(cleanPayload, secret, { expiresIn: options?.expiresIn || '7d' });
  }

  async verifyToken(token: string): Promise<UserPayload> {
    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error(EnvError.JWT_SECRET_NOT_FOUND);
      }
      if (!token) {
        throw new Error(JwtError.JWT_NOT_FOUND);
      }
      const decoded = jwt.verify(token, secret) as DecodedPayload;
      console.log(`[JwtService] Token verified for email: ${decoded.email}`);
      // Return only UserPayload fields
      const { exp, iat, ...userPayload } = decoded;
      return userPayload;
    } catch (error: any) {
      console.error(`[JwtService] Token verification failed: ${error.message}`);
      throw new Error(JwtError.INVALID_JWT);
    }
  }
}