// src/services/admin/interfaces/IAdminSkillService.ts
import { ISkill, ISkillPopulated } from "../../../models/category/skill-model";

export interface IAdminSkillService {
  findSkillByName(name: string, domainId: string): Promise<ISkill | null>;
  findSkillById(id: string): Promise<ISkill | null>;
  addSkill(name: string, domainId: string): Promise<ISkill>;
  updateSkill(id: string, name: string, domainId: string): Promise<ISkill | null>;
  getAllSkills(page: number, limit: number, search?: string, domainId?: string): Promise<{ data: ISkillPopulated[]; total: number }>;
  getSkillsByDomainId(domainId: string): Promise<ISkillPopulated[]>;
  toggleActiveSkill(id: string): Promise<ISkill | null>;
  deleteSkill(id: string): Promise<boolean>;
}