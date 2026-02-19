// src/controllers/admin/admin-skill-controller.ts
import { Request, Response } from 'express';
import { StatusCode } from '../../utils/enum';
import { IAdminSkillService } from '../../services/admin/interfaces/IAdminSkillService';
import {
  SkillSuccessMsg,
  SkillErrorMsg,
  GeneralServerErrorMsg,
} from '../../utils/constants'; // ← adjust names if different
import { appLogger } from '../../utils/logger';
import { Types } from 'mongoose';
import { IAdminSkillController } from './interfaces/IAdminSkillController';

export class AdminSkillController implements IAdminSkillController {
  private _skillService: IAdminSkillService;

  constructor(skillService: IAdminSkillService) {
    this._skillService = skillService;
  }

  async createSkill(req: Request, res: Response): Promise<void> {
    try {
      // ... your code ...
    } catch (error: any) {
      appLogger.error('Create Skill error:', error);
  
      if (error.message?.includes('already exists')) {
        res.status(StatusCode.CONFLICT).json({
          success: false,
          message: error.message, // or SkillErrorMsg.SKILL_ALREADY_EXISTS
        });
        return; // ← keep this return to exit early
      }
  
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: GeneralServerErrorMsg.INTERNAL_SERVER_ERROR,
      });
      // no return here — function ends naturally
    }
  }

  async updateSkill(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, domainId } = req.body;

      if (!Types.ObjectId.isValid(id)) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: SkillErrorMsg.INVALID_ID,
        });
        return;
      }

      if (!name || typeof name !== 'string' || !name.trim()) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: SkillErrorMsg.NAME_REQUIRED,
        });
        return;
      }

      if (domainId && !Types.ObjectId.isValid(domainId)) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: SkillErrorMsg.INVALID_DOMAIN_ID,
        });
        return;
      }

      const trimmedName = name.trim();

      const updated = await this._skillService.updateSkill(id, trimmedName, domainId);

      if (!updated) {
        res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: SkillErrorMsg.SKILL_NOT_FOUND,
        });
        return;
      }

      res.status(StatusCode.OK).json({
        success: true,
        message: SkillSuccessMsg.SKILL_UPDATED,
        data: updated,
      });
    } catch (error: any) {
      appLogger.error('Update Skill error:', error);

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
          message: SkillErrorMsg.INVALID_ID,
        });
        return;
      }

      const updated = await this._skillService.toggleActiveSkill(id);

      if (!updated) {
        res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: SkillErrorMsg.SKILL_NOT_FOUND,
        });
        return;
      }

      const message = updated.isActive
        ? SkillSuccessMsg.SKILL__LISTED
        : SkillSuccessMsg.SKILL__UNLISTED;

      res.status(StatusCode.OK).json({
        success: true,
        message,
        data: updated,
      });
    } catch (error: unknown) {
      appLogger.error('Toggle Skill active error:', error);
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
      const domainId = req.query.domainId as string | undefined;

      if (isNaN(page) || page < 1) page = 1;
      if (isNaN(limit) || limit < 1) limit = 10;

      if (domainId && !Types.ObjectId.isValid(domainId)) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: SkillErrorMsg.INVALID_DOMAIN_ID,
        });
        return;
      }

      const result = await this._skillService.getAllSkills(page, limit, search, domainId);

      res.status(StatusCode.OK).json({
        success: true,
        message: SkillSuccessMsg.SKILLS_FETCHED,
        data: result.data,
        total: result.total,
        page,
        totalPages: Math.ceil(result.total / limit),
      });
    } catch (error: unknown) {
      appLogger.error('Get paginated skills error:', error);
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
          message: SkillErrorMsg.INVALID_ID,
        });
        return;
      }

      const skill = await this._skillService.findSkillById(id);

      if (!skill) {
        res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: SkillErrorMsg.SKILL_NOT_FOUND,
        });
        return;
      }

      res.status(StatusCode.OK).json({
        success: true,
        message: SkillSuccessMsg.SKILL_FETCHED,
        data: skill,
      });
    } catch (error: unknown) {
      appLogger.error('Get skill by ID error:', error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: GeneralServerErrorMsg.INTERNAL_SERVER_ERROR,
      });
    }
  }
}