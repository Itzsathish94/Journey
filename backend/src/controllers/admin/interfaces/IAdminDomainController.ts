import { Request, Response } from 'express';

export interface IAdminDomainController {
  createDomain(req: Request, res: Response): Promise<void>;
  updateDomain(req: Request, res: Response): Promise<void>;
  toggleActiveDomain(req: Request, res: Response): Promise<void>;
  getAllDomainsPaginated(req: Request, res: Response): Promise<void>;
  getDomainById(req: Request, res: Response): Promise<void>;
  // deleteDomain(req: Request, res: Response): Promise<void>;
}