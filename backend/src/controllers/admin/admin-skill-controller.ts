import { Request, Response } from 'express';
import { StatusCode } from '../../utils/enum';
import { IAdminSkillService } from '../../services/admin/interfaces/IAdminSkillService';
import {
  SkillSuccessMsg,
  SkillErrorMsg,
  GeneralServerErrorMsg,
} from '../../utils/constants'; 
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
      const { skillName} = req.body;
  
      if (!skillName || typeof skillName !== 'string' || !skillName.trim()) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: SkillErrorMsg.NAME_REQUIRED,
        });
        return;
      }
  
      const trimmedSkillName = skillName.trim().toLowerCase();
  
      // Check if skill already exists under this domain
      const existing = await this._skillService.findSkillByName(trimmedSkillName);
      if (existing) {
        res.status(StatusCode.CONFLICT).json({
          success: false,
          message: SkillErrorMsg.SKILL_ALREADY_EXISTS,
        });
        return;
      }
  
      const newSkill = await this._skillService.addSkill(trimmedSkillName);
  
      res.status(StatusCode.CREATED).json({
        success: true,
        message: SkillSuccessMsg.SKILL_CREATED,
        data: newSkill,
      });
    } catch (error: any) {
      appLogger.error('Create Skill error:', error);
  
      if (error.message?.includes('already exists')) {
        res.status(StatusCode.CONFLICT).json({
          success: false,
          message: error.message,
        });
        return;
      }
  
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: GeneralServerErrorMsg.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateSkill(req: Request, res: Response): Promise<void> {
    try {
      const { skillId } = req.params;
      const { skillName } = req.body;

      if (!Types.ObjectId.isValid(skillId)) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: SkillErrorMsg.INVALID_ID,
        });
        return;
      }

      if (!skillName || typeof skillName !== 'string' || !skillName.trim()) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: SkillErrorMsg.NAME_REQUIRED,
        });
        return;
      }

      const trimmedSkillName = skillName.trim().toLowerCase();

      const updatedSkill = await this._skillService.updateSkill(skillId, trimmedSkillName);

      if (!updatedSkill) {
        res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: SkillErrorMsg.SKILL_NOT_FOUND,
        });
        return;
      }

      res.status(StatusCode.OK).json({
        success: true,
        message: SkillSuccessMsg.SKILL_UPDATED,
        data: updatedSkill,
      });
    } catch (error: any) {
      appLogger.error('Update Skill error:', error);

      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: GeneralServerErrorMsg.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async toggleActiveSkill(req: Request, res: Response): Promise<void> {
    try {
      const { skillId } = req.params;

      if (!Types.ObjectId.isValid(skillId)) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: SkillErrorMsg.INVALID_ID,
        });
        return;
      }

      const updatedSkill = await this._skillService.toggleActiveSkill(skillId);

      if (!updatedSkill) {
        res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: SkillErrorMsg.SKILL_NOT_FOUND,
        });
        return;
      }

      const message = updatedSkill.isActive
        ? SkillSuccessMsg.SKILL__ACTIVE
        : SkillSuccessMsg.SKILL__INACTIVE;

      res.status(StatusCode.OK).json({
        success: true,
        message,
        data: updatedSkill,
      });
    } catch (error: unknown) {
      appLogger.error('Toggle Skill active error:', error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: GeneralServerErrorMsg.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getAllSkillsPaginated(req: Request, res: Response): Promise<void> {
    try {
      let page = Number(req.query.page);
      let limit = Number(req.query.limit);
      const search = (req.query.search as string) || '';
   
      if (isNaN(page) || page < 1) page = 1;
      if (isNaN(limit) || limit < 1) limit = 10;

      const result = await this._skillService.getAllSkills(page, limit, search);

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

  async getSkillById(req: Request, res: Response): Promise<void> {
    try {
      const { skillId } = req.params;

      if (!Types.ObjectId.isValid(skillId)) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: SkillErrorMsg.INVALID_ID,
        });
        return;
      }

      const skill = await this._skillService.findSkillById(skillId);

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