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
      const { name } = req.body;

      if (!name || typeof name !== 'string' || !name.trim()) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: IndustryErrorMsg.NAME_REQUIRED,
        });
        return;
      }

      const trimmedName = name.trim();

      const existing = await this._industryService.findIndustryByName(trimmedName);
      if (existing) {
        res.status(StatusCode.CONFLICT).json({
          success: false,
          message: IndustryErrorMsg.INDUSTRY_ALREADY_EXISTS,
        });
        return;
      }

      const created = await this._industryService.addIndustry(trimmedName);

      res.status(StatusCode.CREATED).json({
        success: true,
        message: IndustrySuccessMsg.INDUSTRY_CREATED,
        data: created,
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
      const { id } = req.params;
      const { name } = req.body;

      if (!Types.ObjectId.isValid(id)) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: IndustryErrorMsg.INVALID_ID,
        });
        return;
      }

      if (!name || typeof name !== 'string' || !name.trim()) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: IndustryErrorMsg.NAME_REQUIRED,
        });
        return;
      }

      const trimmedName = name.trim();

      const existing = await this._industryService.findIndustryByName(trimmedName);
      if (existing && existing._id.toString() !== id) {
        res.status(StatusCode.CONFLICT).json({
          success: false,
          message: IndustryErrorMsg.INDUSTRY_ALREADY_EXISTS,
        });
        return;
      }

      const updated = await this._industryService.updateIndustry(id, trimmedName);

      if (!updated) {
        res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: IndustryErrorMsg.INDUSTRY_NOT_FOUND,
        });
        return;
      }

      res.status(StatusCode.OK).json({
        success: true,
        message: IndustrySuccessMsg.INDUSTRY_UPDATED,
        data: updated,
      });
    } catch (error: unknown) {
      appLogger.error('Update Industry error:', error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: GeneralServerErrorMsg.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async toggleActive(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!Types.ObjectId.isValid(id)) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: IndustryErrorMsg.INVALID_ID,
        });
        return;
      }

      const updated = await this._industryService.toggleActiveIndustry(id);

      if (!updated) {
        res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: IndustryErrorMsg.INDUSTRY_NOT_FOUND,
        });
        return;
      }

      const message = updated.isActive
        ? IndustrySuccessMsg.INDUSTRY__LISTED
        : IndustrySuccessMsg.INDUSTRY__UNLISTED;

      res.status(StatusCode.OK).json({
        success: true,
        message,
        data: updated,
      });
    } catch (error: unknown) {
      appLogger.error('Toggle Industry active error:', error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: GeneralServerErrorMsg.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getAllPaginated(req: Request, res: Response): Promise<void> {
    try {
      let page = Number(req.query.page);
      let limit = Number(req.query.limit);
      const search = (req.query.search as string) || '';

      if (isNaN(page) || page < 1) page = 1;
      if (isNaN(limit) || limit < 1) limit = 10;

      const result = await this._industryService.getAllIndustries(page, limit, search);

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

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!Types.ObjectId.isValid(id)) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: IndustryErrorMsg.INVALID_ID,
        });
        return;
      }

      const industry = await this._industryService.findIndustryById(id);

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