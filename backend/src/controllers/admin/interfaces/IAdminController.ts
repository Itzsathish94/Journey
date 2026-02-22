import { Request, Response } from "express";

export interface IAdminController {
  login(req: Request, res: Response): Promise<void>;
  logout(req: Request, res: Response): Promise<void>;
  getAllUsers(req: Request, res: Response): Promise<void>;
  getAllInterviewers(req: Request, res: Response): Promise<void>;
  blockOrUnblockUser(req: Request, res: Response): Promise<void>;
  blockOrUnblockInterviewer(req: Request, res: Response): Promise<void>;
}