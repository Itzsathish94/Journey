import { Request, Response } from 'express';
import { StatusCode } from '../../utils/enum';
import { IAdminDomainService } from '../../services/admin/interfaces/IAdminDomainService';
import {
  DomainSuccessMsg,
  DomainErrorMsg,
  GeneralServerErrorMsg,
} from '../../utils/constants';
import { appLogger } from '../../utils/logger';
import { Types } from 'mongoose';
import { IAdminDomainController } from './interfaces/IAdminDomainController';

export class AdminDomainController implements IAdminDomainController {
  private _domainService: IAdminDomainService;

  constructor(domainService: IAdminDomainService) {
    this._domainService = domainService;
  }

  async createDomain(req: Request, res: Response): Promise<void> {
    try {
      const { domainName } = req.body;
  
      if (!domainName || typeof domainName !== 'string' || !domainName.trim()) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: DomainErrorMsg.NAME_REQUIRED,
        });
        return;
      }
  
      const trimmedDomainName = domainName.trim().toLowerCase();
  
      const existingDomain = await this._domainService.findDomainByName(trimmedDomainName);
      if (existingDomain) {
        res.status(StatusCode.CONFLICT).json({
          success: false,
          message: DomainErrorMsg.DOMAIN_ALREADY_EXISTS,
        });
        return;
      }
  
      const createdDomain = await this._domainService.addDomain(trimmedDomainName);
  
      res.status(StatusCode.CREATED).json({
        success: true,
        message: DomainSuccessMsg.DOMAIN_CREATED,
        data: createdDomain,
      });
      return;
    } catch (error: unknown) {
      const message =
        error instanceof Error && error.message.includes('already exists')
          ? error.message
          : GeneralServerErrorMsg.INTERNAL_SERVER_ERROR;
  
      appLogger.error('Create Domain error:', error);
  
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message,
      });
      return;
    }
  }

  async updateDomain(req: Request, res: Response): Promise<void> {
    try {
      const { domainId } = req.params;
      const { domainName } = req.body;

      if (!Types.ObjectId.isValid(domainId)) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: DomainErrorMsg.INVALID_ID,
        });
        return;
      }

      if (!domainName || typeof domainName !== 'string' || !domainName.trim()) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: DomainErrorMsg.NAME_REQUIRED,
        });
        return;
      }

      const trimmedDomainName = domainName.trim().toLowerCase();

      const existingDomain = await this._domainService.findDomainByName(trimmedDomainName);
      if (existingDomain && existingDomain._id.toString() !== domainId) {
        res.status(StatusCode.CONFLICT).json({
          success: false,
          message: DomainErrorMsg.DOMAIN_ALREADY_EXISTS,
        });
        return;
      }

      const updatedDomain = await this._domainService.updateDomain(domainId, trimmedDomainName);

      if (!updatedDomain) {
        res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: DomainErrorMsg.DOMAIN_NOT_FOUND,
        });
        return;
      }

      res.status(StatusCode.OK).json({
        success: true,
        message: DomainSuccessMsg.DOMAIN_UPDATED,
        data: updatedDomain,
      });
    } catch (error: unknown) {
      appLogger.error('Update Domain error:', error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: GeneralServerErrorMsg.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async toggleActiveDomain(req: Request, res: Response): Promise<void> {
    try {
      const { domainId } = req.params;

      if (!Types.ObjectId.isValid(domainId)) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: DomainErrorMsg.INVALID_ID,
        });
        return;
      }

      const updatedDomain = await this._domainService.toggleActiveDomain(domainId);

      if (!updatedDomain) {
        res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: DomainErrorMsg.DOMAIN_NOT_FOUND,
        });
        return;
      }

      const message = updatedDomain.isActive
        ? DomainSuccessMsg.DOMAIN__ACTIVATED
        : DomainSuccessMsg.DOMAIN__INACTIVATED;

      res.status(StatusCode.OK).json({
        success: true,
        message,
        data: updatedDomain,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : GeneralServerErrorMsg.INTERNAL_SERVER_ERROR;
    
      appLogger.error('Toggle Domain active error:', error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message,
      });
    }
  }

  async getAllDomainsPaginated(req: Request, res: Response): Promise<void> {
    try {
      let page = Number(req.query.page);
      let limit = Number(req.query.limit);
      const search = (req.query.search as string) || '';

      // Default values if not provided or invalid
      if (isNaN(page) || page < 1) page = 1;
      if (isNaN(limit) || limit < 1) limit = 10;

      const result = await this._domainService.getAllDomainsPaginated(page, limit, search);

      res.status(StatusCode.OK).json({
        success: true,
        message: DomainSuccessMsg.DOMAINS_FETCHED,
        data: result.data,
        total: result.total,
        page,
        totalPages: Math.ceil(result.total / limit),
      });
    } catch (error: unknown) {
      appLogger.error('Get paginated domains error:', error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: GeneralServerErrorMsg.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getDomainById(req: Request, res: Response): Promise<void> {
    try {
      const { domainId } = req.params;

      if (!Types.ObjectId.isValid(domainId)) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: DomainErrorMsg.INVALID_ID,
        });
        return;
      }

      const domain = await this._domainService.findDomainById(domainId);

      if (!domain) {
        res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: DomainErrorMsg.DOMAIN_NOT_FOUND,
        });
        return;
      }

      res.status(StatusCode.OK).json({
        success: true,
        message: DomainSuccessMsg.DOMAINS_FETCHED,
        data: domain,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : GeneralServerErrorMsg.INTERNAL_SERVER_ERROR;
    
      appLogger.error('Get domain by ID error:', error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message,
      });
    }
  }
}