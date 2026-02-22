// src/services/admin/admin-skill-service.ts
import { IAdminSkillService } from "./interfaces/IAdminSkillService";
import { IAdminSkillRepository } from "../../repositories/admin-repository/interfaces/IAdminSkillRepository";
import { ISkillModel } from "../../models/category/skill-model";

export class AdminSkillService implements IAdminSkillService {
  private _skillRepository: IAdminSkillRepository;

  constructor(skillRepository: IAdminSkillRepository) {
    this._skillRepository = skillRepository;
  }

  async findSkillByName(skillName: string): Promise<ISkillModel | null> {
    return this._skillRepository.findSkillByName(skillName);
  }

  async findSkillById(skillId: string): Promise<ISkillModel | null> {
    return this._skillRepository.findById(skillId);
  }

  async addSkill(skillName: string): Promise<ISkillModel> {
    const trimmedSkillName = skillName.trim();
    if (!trimmedSkillName) {
      throw new Error("Skill name is required");
    }
  
    const existingSkill = await this.findSkillByName(trimmedSkillName);
    if (existingSkill) {
      throw new Error(`Skill "${trimmedSkillName}" already exists`);
    }
  
    return this._skillRepository.create({
      skillName: trimmedSkillName,
    });
  }
  
  async updateSkill(skillId: string, skillName: string): Promise<ISkillModel | null> {
    return this._skillRepository.update(skillId, {
      skillName,
    });
  }

  async getAllSkills(
    page: number,
    limit: number,
    search: string = ""
  ): Promise<{ data: ISkillModel[]; total: number }> {
    return this._skillRepository.getAllSkillsPaginated(page, limit, search);
  }

  async toggleActiveSkill(skillId: string): Promise<ISkillModel | null> {
    return this._skillRepository.toggleActive(skillId);
  }

  async deleteSkill(skillId: string): Promise<boolean> {
    const result = await this._skillRepository.delete(skillId);
    return !!result;
  }
}