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
  toggleActiveIndustry(req: Request, res: Response): Promise<void>;

  /**
   * Get paginated list of industries (with optional search)
   */
  getAllIndustriesPaginated(req: Request, res: Response): Promise<void>;

  /**
   * Get a single industry by ID
   */
  getIndustryById(req: Request, res: Response): Promise<void>;
}