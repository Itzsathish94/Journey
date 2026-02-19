// src/repositories/admin-repository/interfaces/IAdminIndustryRepository.ts
import { IIndustry } from "../../../models/category/industry-model";
import { IGenericRepository } from "../../generic-repository";

export interface IAdminIndustryRepository extends IGenericRepository<IIndustry> {
  findIndustryByName(name: string): Promise<IIndustry | null>;
  toggleActive(id: string): Promise<IIndustry | null>;
  getAllIndustriesPaginated(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ data: IIndustry[]; total: number }>;
}