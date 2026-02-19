// src/controllers/admin/admin-industry-controller.ts
import { Request, Response } from 'express';
import { StatusCode } from '../../utils/enum';
import { IAdminIndustryService } from '../../services/admin/interfaces/IAdminIndustryService';
import {
  IndustrySuccessMsg,
  IndustryErrorMsg,
  GeneralServerErrorMsg,
} from '../../utils/constants';
import { appLogger } from '../../utils/logger';
import { Types } from 'mongoose';
import { IAdminIndustryController } from './interfaces/IAdminIndustryContoller';

export class AdminIndustryController implements IAdminIndustryController {
  private _industryService: IAdminIndustryService;

  constructor(industryService: IAdminIndustryService) {
    this._industryService = industryService;
  }

  async createIndustry(req: Request, res: Response): Promise<void> {
    try {
      const { industryName } = req.body;

      if (!industryName || typeof industryName !== 'string' || !industryName.trim()) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: IndustryErrorMsg.NAME_REQUIRED,
        });
        return;
      }

      const trimmedIndustryName = industryName.trim().toLowerCase();

      const existingIndustry = await this._industryService.findIndustryByName(trimmedIndustryName);
      if (existingIndustry) {
        res.status(StatusCode.CONFLICT).json({
          success: false,
          message: IndustryErrorMsg.INDUSTRY_ALREADY_EXISTS,
        });
        return;
      }

      const createdIndustry = await this._industryService.addIndustry(trimmedIndustryName);

      res.status(StatusCode.CREATED).json({
        success: true,
        message: IndustrySuccessMsg.INDUSTRY_CREATED,
        data: createdIndustry,
      });
    } catch (error: unknown) {
      appLogger.error('Create Industry error:', error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: GeneralServerErrorMsg.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateIndustry(req: Request, res: Response): Promise<void> {
    try {
      const { industryId } = req.params;
      const { industryName } = req.body;

      if (!Types.ObjectId.isValid(industryId)) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: IndustryErrorMsg.INVALID_ID,
        });
        return;
      }

      if (!industryName || typeof industryName !== 'string' || !industryName.trim()) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: IndustryErrorMsg.NAME_REQUIRED,
        });
        return;
      }

      const trimmedIndustryName = industryName.trim().toLowerCase();

      const existingIndustry = await this._industryService.findIndustryByName(trimmedIndustryName);
      if (existingIndustry && existingIndustry._id.toString() !== industryId) {
        res.status(StatusCode.CONFLICT).json({
          success: false,
          message: IndustryErrorMsg.INDUSTRY_ALREADY_EXISTS,
        });
        return;
      }

      const updatedIndustry = await this._industryService.updateIndustry(industryId, trimmedIndustryName);

      if (!updatedIndustry) {
        res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: IndustryErrorMsg.INDUSTRY_NOT_FOUND,
        });
        return;
      }

      res.status(StatusCode.OK).json({
        success: true,
        message: IndustrySuccessMsg.INDUSTRY_UPDATED,
        data: updatedIndustry,
      });
    } catch (error: unknown) {
      appLogger.error('Update Industry error:', error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: GeneralServerErrorMsg.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async toggleActiveIndustry(req: Request, res: Response): Promise<void> {
    try {
      const { industryId } = req.params;

      if (!Types.ObjectId.isValid(industryId)) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: IndustryErrorMsg.INVALID_ID,
        });
        return;
      }

      const updatedIndustry = await this._industryService.toggleActiveIndustry(industryId);

      if (!updatedIndustry) {
        res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: IndustryErrorMsg.INDUSTRY_NOT_FOUND,
        });
        return;
      }

      const message = updatedIndustry.isActive
        ? IndustrySuccessMsg.INDUSTRY__ACTIVE
        : IndustrySuccessMsg.INDUSTRY__INACTIVE;

      res.status(StatusCode.OK).json({
        success: true,
        message,
        data: updatedIndustry,
      });
    } catch (error: unknown) {
      appLogger.error('Toggle Industry active error:', error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: GeneralServerErrorMsg.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getAllIndustriesPaginated(req: Request, res: Response): Promise<void> {
    try {
      let page = Number(req.query.page);
      let limit = Number(req.query.limit);
      const search = (req.query.search as string) || '';

      if (isNaN(page) || page < 1) page = 1;
      if (isNaN(limit) || limit < 1) limit = 10;

      const result = await this._industryService.getAllIndustriesPaginated(page, limit, search);

      res.status(StatusCode.OK).json({
        success: true,
        message: IndustrySuccessMsg.INDUSTRIES_FETCHED,
        data: result.data,
        total: result.total,
        page,
        totalPages: Math.ceil(result.total / limit),
      });
    } catch (error: unknown) {
      appLogger.error('Get paginated industries error:', error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: GeneralServerErrorMsg.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getIndustryById(req: Request, res: Response): Promise<void> {
    try {
      const { industryId } = req.params;

      if (!Types.ObjectId.isValid(industryId)) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: IndustryErrorMsg.INVALID_ID,
        });
        return;
      }

      const industry = await this._industryService.findIndustryById(industryId);

      if (!industry) {
        res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: IndustryErrorMsg.INDUSTRY_NOT_FOUND,
        });
        return;
      }

      res.status(StatusCode.OK).json({
        success: true,
        message: IndustrySuccessMsg.INDUSTRY_FETCHED,
        data: industry,
      });
    } catch (error: unknown) {
      appLogger.error('Get industry by ID error:', error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: GeneralServerErrorMsg.INTERNAL_SERVER_ERROR,
      });
    }
  }
}