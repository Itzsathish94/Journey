// src/services/admin/interfaces/IAdminIndustryService.ts
import { IIndustryModel } from "../../../models/category/industry-model";

export interface IAdminIndustryService {
  findIndustryByName(industryName: string): Promise<IIndustryModel | null>;
  findIndustryById(industryId: string): Promise<IIndustryModel | null>;
  addIndustry(industryName: string): Promise<IIndustryModel>;
  updateIndustry(industryId: string, name: string): Promise<IIndustryModel | null>;
  getAllIndustriesPaginated(  
    page: number,
    limit: number,
    search?: string
  ): Promise<{ data: IIndustryModel[]; total: number }>;
  toggleActiveIndustry(industryId: string): Promise<IIndustryModel | null>;
  deleteIndustry(industryId: string): Promise<boolean>;
}