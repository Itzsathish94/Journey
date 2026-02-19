// src/controllers/admin/interfaces/IAdminIndustryController.ts
import { Request, Response } from 'express';

export interface IAdminIndustryController {
  /**
   * Create a new industry
   */
  createIndustry(req: Request, res: Response): Promise<void>;

  /**
   * Update an existing industry
   */
  updateIndustry(req: Request, res: Response): Promise<void>;

  /**
   * Toggle active/inactive (list/unlist) status of an industry
   */
  toggleActive(req: Request, res: Response): Promise<void>;

  /**
   * Get paginated list of industries (with optional search)
   */
  getAllPaginated(req: Request, res: Response): Promise<void>;

  /**
   * Get a single industry by ID
   */
  getById(req: Request, res: Response): Promise<void>;
}