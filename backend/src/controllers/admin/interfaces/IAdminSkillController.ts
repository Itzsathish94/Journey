// src/controllers/admin/interfaces/IAdminSkillController.ts
import { Request, Response } from 'express';

export interface IAdminSkillController {
  createSkill(req: Request, res: Response): Promise<void>;
  updateSkill(req: Request, res: Response): Promise<void>;
  toggleActiveSkill(req: Request, res: Response): Promise<void>;
  getAllSkillsPaginated(req: Request, res: Response): Promise<void>;
  getSkillById(req: Request, res: Response): Promise<void>;
  // deleteSkill(req: Request, res: Response): Promise<void>;
}