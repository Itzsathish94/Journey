// src/services/admin/admin-skill-service.ts
import { IAdminSkillService } from "./interfaces/IAdminSkillService";
import { IAdminSkillRepository } from "../../repositories/admin-repository/interfaces/IAdminSkillRepository";
import { ISkill, ISkillPopulated } from "../../models/category/skill-model";
import { Types } from 'mongoose';

export class AdminSkillService implements IAdminSkillService {
  private _skillRepository: IAdminSkillRepository;

  constructor(skillRepository: IAdminSkillRepository) {
    this._skillRepository = skillRepository;
  }

  async findSkillByName(name: string, domainId: string): Promise<ISkill | null> {
    return this._skillRepository.findSkillByName(name, domainId);
  }

  async findSkillById(id: string): Promise<ISkill | null> {
    return this._skillRepository.findById(id);
  }

  async addSkill(name: string, domainId: string): Promise<ISkill> {
    const trimmedName = name.trim();
    if (!trimmedName) {
      throw new Error("Skill name is required");
    }
  
    const existing = await this.findSkillByName(trimmedName, domainId);
    if (existing) {
      throw new Error(`Skill "${trimmedName}" already exists in this domain`);
    }
  
    if (!Types.ObjectId.isValid(domainId)) {
      throw new Error("Invalid domain ID");
    }
  
    // Just pass the string — Mongoose casts it automatically
    return this._skillRepository.create({
      name: trimmedName,
      domainId,           // ← string is fine here
    });
  }
  
  async updateSkill(id: string, name: string, domainId: string): Promise<ISkill | null> {
    if (!Types.ObjectId.isValid(domainId)) {
      throw new Error("Invalid domain ID format");
    }
  
    return this._skillRepository.update(id, {
      name,
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

  async toggleActiveSkill(id: string): Promise<ISkill | null> {
    return this._skillRepository.toggleActive(id);
  }

  async deleteSkill(id: string): Promise<boolean> {
    const result = await this._skillRepository.delete(id);
    return !!result;  // Convert to boolean
  }
}