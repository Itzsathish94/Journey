// src/services/admin/admin-industry-service.ts
import { IAdminIndustryService } from "./interfaces/IAdminIndustryService";
import { IAdminIndustryRepository } from "../../repositories/admin-repository/interfaces/IAdminIndustryRepository";
import { IIndustryModel } from "../../models/category/industry-model";

export class AdminIndustryService implements IAdminIndustryService {
  private _industryRepository: IAdminIndustryRepository;

  constructor(industryRepository: IAdminIndustryRepository) {
    this._industryRepository = industryRepository;
  }

  async findIndustryByName(industryName: string): Promise<IIndustryModel | null> {
    return this._industryRepository.findIndustryByName(industryName);
  }

  async findIndustryById(industryId: string): Promise<IIndustryModel | null> {
    return this._industryRepository.findById(industryId);
  }

  async addIndustry(industryName: string): Promise<IIndustryModel> {
    return this._industryRepository.create({ industryName });
  }

  async updateIndustry(industryId: string, industryName: string): Promise<IIndustryModel | null> {
    return this._industryRepository.update(industryId, { industryName });
  }

  async getAllIndustriesPaginated(
    page: number,
    limit: number,
    search: string = ""
  ): Promise<{ data: IIndustryModel[]; total: number }> {
    return this._industryRepository.getAllIndustriesPaginated(page, limit, search);
  }

  async toggleActiveIndustry(industryId: string): Promise<IIndustryModel | null> {
    return this._industryRepository.toggleActive(industryId);
  }

  async deleteIndustry(industryId: string): Promise<boolean> {
    const result = await this._industryRepository.delete(industryId);
    return !!result;  // Convert to boolean
  }
}