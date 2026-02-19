// src/repositories/admin-repository/interfaces/IAdminIndustryRepository.ts
import { IIndustryModel } from "../../../models/category/industry-model";
import { IGenericRepository } from "../../generic-repository";

export interface IAdminIndustryRepository extends IGenericRepository<IIndustryModel> {
  findIndustryByName(industryName: string): Promise<IIndustryModel | null>;
  toggleActive(industryId: string): Promise<IIndustryModel | null>;
  getAllIndustriesPaginated(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ data: IIndustryModel[]; total: number }>;
}