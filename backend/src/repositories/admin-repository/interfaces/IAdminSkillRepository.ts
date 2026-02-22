// src/repositories/admin-repository/interfaces/IAdminSkillRepository.ts
import { ISkillModel } from "../../../models/category/skill-model";
import { IGenericRepository } from "../../generic-repository";

export interface IAdminSkillRepository extends IGenericRepository<ISkillModel> {
  findSkillByName(skillName: string): Promise<ISkillModel | null>; 
  toggleActive(skillId: string): Promise<ISkillModel | null>;
  getAllSkillsPaginated(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ data: ISkillModel[]; total: number }>; 
}