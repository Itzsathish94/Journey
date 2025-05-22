import refreshTokenModel, { IRefreshToken } from '../models/refresh-token';
import IRefreshTokenRepository from './interfaces/IRefreshTokenRepository';
import { GenericRepository } from './generic-repository';

export class RefreshTokenRepository extends GenericRepository<IRefreshToken> implements IRefreshTokenRepository {
  constructor() {
    super(refreshTokenModel);
  }

  async createToken(data: Partial<IRefreshToken>): Promise<IRefreshToken> {
    try {
      return await this.create(data);
    } catch (error) {
      throw error;
    }
  }

  async findToken(token: string): Promise<IRefreshToken | null> {
    try {
      return await this.findOne({ token });
    } catch (error) {
      throw error;
    }
  }

  async deleteToken(token: string): Promise<void> {
    try {
      await this.deleteOne({ token });
    } catch (error) {
      throw error;
    }
  }
}