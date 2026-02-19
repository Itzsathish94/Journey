// src/services/admin/interfaces/IAdminSkillService.ts
import { ISkillModel, ISkillPopulated } from "../../../models/category/skill-model";

export interface IAdminSkillService {
  findSkillByName(skillName: string, domainId: string): Promise<ISkillModel | null>;
  findSkillById(SkillId: string): Promise<ISkillModel | null>;
  addSkill(skillName: string, domainId: string): Promise<ISkillModel>;
  updateSkill(SkillId: string, skillName: string, domainId: string): Promise<ISkillModel | null>;
  getAllSkills(page: number, limit: number, search?: string, domainId?: string): Promise<{ data: ISkillPopulated[]; total: number }>;
  getSkillsByDomainId(domainId: string): Promise<ISkillPopulated[]>;
  toggleActiveSkill(SkillId: string): Promise<ISkillModel | null>;
  deleteSkill(SkillId: string): Promise<boolean>;
}