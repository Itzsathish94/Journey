import { Response } from "express";
import { AuthenticatedRequest } from "../../../middlewares/authenticated-routes";

export interface IInterviewerMockController {
  getMyMocks(req: AuthenticatedRequest, res: Response): Promise<void>;
  createMock(req: AuthenticatedRequest, res: Response): Promise<void>;
  updateMock(req: AuthenticatedRequest, res: Response): Promise<void>;
  toggleMock(req: AuthenticatedRequest, res: Response): Promise<void>;
}

