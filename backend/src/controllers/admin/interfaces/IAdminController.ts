import { Request, Response } from "express";

export interface IAdminController {
  login(req: Request, res: Response): Promise<void>;
  logout(req: Request, res: Response): Promise<void>;
  getAllUsers(req: Request, res: Response): Promise<void>;
  getAllInterviewers(req: Request, res: Response): Promise<void>;
  blockUser(req: Request, res: Response): Promise<void>;
  blockInterviewer(req: Request, res: Response): Promise<void>;
}