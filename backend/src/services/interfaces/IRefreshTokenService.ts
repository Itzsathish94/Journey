import { IRefreshToken } from '../../models/refresh-token';

export default interface IRefreshTokenServices {
  createToken(userId: string, token: string): Promise<IRefreshToken>;
  findToken(token: string): Promise<IRefreshToken | null>;
  deleteToken(token: string): Promise<void>;
}