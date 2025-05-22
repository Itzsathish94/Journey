import { Request, Response } from 'express';

export default interface IAuthController {
  userSignUp(req: Request, res: Response): Promise<any>;
  createUser(req: Request, res: Response): Promise<any>;
  login(req: Request, res: Response): Promise<any>;
  refreshAccessToken(req: Request, res: Response): Promise<any>;
  logout(req: Request, res: Response): Promise<any>;
  clearAllTokens(req: Request, res: Response): Promise<any>;
}