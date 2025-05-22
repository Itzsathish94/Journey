import { Request, Response } from 'express';

export default interface IUserController {
  placeholder(req: Request, res: Response): Promise<any>;
}