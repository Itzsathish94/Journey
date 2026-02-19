// src/services/admin/admin-skill-service.ts
import { IAdminSkillService } from "./interfaces/IAdminSkillService";
import { IAdminSkillRepository } from "../../repositories/admin-repository/interfaces/IAdminSkillRepository";
import { ISkillModel, ISkillPopulated } from "../../models/category/skill-model";
import { Types } from 'mongoose';

export class AdminSkillService implements IAdminSkillService {
  private _skillRepository: IAdminSkillRepository;

  constructor(skillRepository: IAdminSkillRepository) {
    this._skillRepository = skillRepository;
  }

  async findSkillByName(skillName: string, domainId: string): Promise<ISkillModel | null> {
    return this._skillRepository.findSkillByName(skillName, domainId);
  }

  async findSkillById(skillId: string): Promise<ISkillModel | null> {
    return this._skillRepository.findById(skillId);
  }

  async addSkill(skillName: string, domainId: string): Promise<ISkillModel> {
    const trimmedSkillName = skillName.trim();
    if (!trimmedSkillName) {
      throw new Error("Skill name is required");
    }
  
    const existingSkill = await this.findSkillByName(trimmedSkillName, domainId);
    if (existingSkill) {
      throw new Error(`Skill "${trimmedSkillName}" already exists in this domain`);
    }
  
    if (!Types.ObjectId.isValid(domainId)) {
      throw new Error("Invalid domain ID");
    }
  
    // Just pass the string — Mongoose casts it automatically
    return this._skillRepository.create({
      skillName: trimmedSkillName,
      domainId,           // ← string is fine here
    });
  }
  
  async updateSkill(skillId: string, skillName: string, domainId: string): Promise<ISkillModel | null> {
    if (!Types.ObjectId.isValid(domainId)) {
      throw new Error("Invalid domain ID format");
    }
  
    return this._skillRepository.update(skillId, {
      skillName,
      domainId,           // ← string is fine here too
    });
  }

  async getAllSkills(
    page: number,
    limit: number,
    search: string = "",
    domainId?: string
  ): Promise<{ data: ISkillPopulated[]; total: number }> {
    return this._skillRepository.getAllSkillsPaginated(page, limit, search, domainId);
  }

  async getSkillsByDomainId(domainId: string): Promise<ISkillPopulated[]> {
    return this._skillRepository.getSkillsByDomainId(domainId);
  }

  async toggleActiveSkill(skillId: string): Promise<ISkillModel | null> {
    return this._skillRepository.toggleActive(skillId);
  }

  async deleteSkill(skillId: string): Promise<boolean> {
    const result = await this._skillRepository.delete(skillId);
    return !!result;  // Convert to boolean
  }
}