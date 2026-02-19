// src/repositories/admin-repository/interfaces/IAdminSkillRepository.ts
import { ISkillModel, ISkillPopulated } from "../../../models/category/skill-model";
import { IGenericRepository } from "../../generic-repository";

export interface IAdminSkillRepository extends IGenericRepository<ISkillModel> {
  findSkillByName(name: string, domainId: string): Promise<ISkillModel | null>;
  toggleActive(skillId: string): Promise<ISkillModel | null>;
  getAllSkillsPaginated(
    page: number,
    limit: number,
    search?: string,
    domainId?: string
  ): Promise<{ data: ISkillPopulated[]; total: number }>;
  getSkillsByDomainId(domainId: string): Promise<ISkillPopulated[]>;
}