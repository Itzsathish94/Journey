import { Request, Response } from 'express';

export interface IAdminDomainController {
  /**
   * Create a new domain
   */
  createDomain(req: Request, res: Response): Promise<void>;

  /**
   * Update an existing domain
   */
  updateDomain(req: Request, res: Response): Promise<void>;

  /**
   * Toggle active/inactive status of a domain
   */
  toggleActiveDomain(req: Request, res: Response): Promise<void>;

  /**
   * Get paginated list of domains (with optional search)
   */
  getAllDomainsPaginated(req: Request, res: Response): Promise<void>;

  /**
   * Get a single domain by ID
   */
  getDomainById(req: Request, res: Response): Promise<void>;

  /**
   * Optional: Soft delete or permanent delete
   * (include only if needed in your project)
   */
  // deleteDomain(req: Request, res: Response): Promise<void>;
}