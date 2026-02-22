// src/services/admin/interfaces/IAdminSkillService.ts
import { ISkillModel } from "../../../models/category/skill-model";

export interface IAdminSkillService {
  findSkillByName(skillName: string): Promise<ISkillModel | null>; 
  findSkillById(skillId: string): Promise<ISkillModel | null>
  addSkill(skillName: string): Promise<ISkillModel>; 
  updateSkill(skillId: string, skillName: string): Promise<ISkillModel | null>; 
  getAllSkills(page: number, limit: number, search?: string): Promise<{ data: ISkillModel[]; total: number }>; 
  toggleActiveSkill(skillId: string): Promise<ISkillModel | null>;
  deleteSkill(skillId: string): Promise<boolean>;
}