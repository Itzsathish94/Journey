// src/controllers/admin/interfaces/IAdminSkillController.ts
import { Request, Response } from 'express';

export interface IAdminSkillController {
  /**
   * Create a new skill (requires name and domainId)
   */
  createSkill(req: Request, res: Response): Promise<void>;

  /**
   * Update an existing skill (name and/or domainId)
   */
  updateSkill(req: Request, res: Response): Promise<void>;

  /**
   * Toggle active/inactive status of a skill
   */
  toggleActiveSkill(req: Request, res: Response): Promise<void>;

  /**
   * Get paginated list of skills (with optional search and domain filter)
   */
  getAllSkillsPaginated(req: Request, res: Response): Promise<void>;

  /**
   * Get a single skill by ID (with populated domain if needed)
   */
  getSkillById(req: Request, res: Response): Promise<void>;

  /**
   * Optional: Delete a skill (if you implement soft/hard delete)
   */
  // deleteSkill(req: Request, res: Response): Promise<void>;
}