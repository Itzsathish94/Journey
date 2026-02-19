// src/services/admin/interfaces/IAdminIndustryService.ts
import { IIndustry } from "../../../models/category/industry-model";

export interface IAdminIndustryService {
  findIndustryByName(name: string): Promise<IIndustry | null>;
  findIndustryById(id: string): Promise<IIndustry | null>;
  addIndustry(name: string): Promise<IIndustry>;
  updateIndustry(id: string, name: string): Promise<IIndustry | null>;
  getAllIndustries(page: number, limit: number, search?: string): Promise<{ data: IIndustry[]; total: number }>;
  toggleActiveIndustry(id: string): Promise<IIndustry | null>;
  deleteIndustry(id: string): Promise<boolean>;
}