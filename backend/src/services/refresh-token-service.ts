import { IRefreshToken } from '../models/refresh-token';
import IRefreshTokenRepository from '../repositories/interfaces/IRefreshTokenRepository';
import IRefreshTokenServices from './interfaces/IRefreshTokenService';
import mongoose from 'mongoose';

export class RefreshTokenService implements IRefreshTokenServices {
  private refreshTokenRepository: IRefreshTokenRepository;

  constructor(refreshTokenRepository?: IRefreshTokenRepository) {
    this.refreshTokenRepository = refreshTokenRepository || new (require('../repositories/refresh-token-repository').RefreshTokenRepository)();
  }

  async createToken(userId: string, token: string): Promise<IRefreshToken> {
    try {
      return await this.refreshTokenRepository.createToken({
        userId: new mongoose.Types.ObjectId(userId),
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });
    } catch (error) {
      throw error;
    }
  }

  async findToken(token: string): Promise<IRefreshToken | null> {
    try {
      return await this.refreshTokenRepository.findToken(token);
    } catch (error) {
      throw error;
    }
  }

  async deleteToken(token: string): Promise<void> {
    try {
      if (token) {
        await this.refreshTokenRepository.deleteToken(token);
      } else {
        await this.refreshTokenRepository.deleteMany({});
      }
    } catch (error) {
      throw error;
    }
  }
}