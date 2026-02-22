import { Request , Response } from "express";
// import { AuthenticatedRequest } from "../../../middlewares/authenticated-routes";

export interface IInterviewerMockController {
  getMyMocks(req: Request, res: Response): Promise<void>;
  createMock(req: Request, res: Response): Promise<void>;
  updateMock(req: Request, res: Response): Promise<void>;
  toggleMock(req: Request, res: Response): Promise<void>;
}

