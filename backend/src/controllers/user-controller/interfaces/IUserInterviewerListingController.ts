import { Request, Response } from "express";

export interface IUserInterviewerListingController {
  listinterviewers(req: Request, res: Response): Promise<void>;
  getinterviewerById(req: Request, res: Response): Promise<void>;
  getAvailableFilters(req: Request, res: Response): Promise<void>;
}