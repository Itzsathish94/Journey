// src/repositories/admin-repository/interfaces/IAdminSkillRepository.ts
import { ISkill, ISkillPopulated } from "../../../models/category/skill-model";
import { IGenericRepository } from "../../generic-repository";

export interface IAdminSkillRepository extends IGenericRepository<ISkill> {
  findSkillByName(name: string, domainId: string): Promise<ISkill | null>;
  toggleActive(id: string): Promise<ISkill | null>;
  getAllSkillsPaginated(
    page: number,
    limit: number,
    search?: string,
    domainId?: string
  ): Promise<{ data: ISkillPopulated[]; total: number }>;
  getSkillsByDomainId(domainId: string): Promise<ISkillPopulated[]>;
}