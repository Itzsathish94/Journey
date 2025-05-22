import { IRefreshToken } from '../../models/refresh-token';

export default interface IRefreshTokenRepository {
  createToken(data: Partial<IRefreshToken>): Promise<IRefreshToken>;
  findToken(token: string): Promise<IRefreshToken | null>;
  deleteToken(token: string): Promise<void>;
  deleteMany(query: object): Promise<void>;
}