import { Request, Response } from "express";

export default interface IInterviewerVerificationController {
  submitRequest(req: Request, res: Response): Promise<void>;

  getRequestByEmail(req: Request, res: Response): Promise<void>;
}