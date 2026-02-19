// src/services/admin/admin-industry-service.ts
import { IAdminIndustryService } from "./interfaces/IAdminIndustryService";
import { IAdminIndustryRepository } from "../../repositories/admin-repository/interfaces/IAdminIndustryRepository";
import { IIndustry } from "../../models/category/industry-model";

export class AdminIndustryService implements IAdminIndustryService {
  private _industryRepository: IAdminIndustryRepository;

  constructor(industryRepository: IAdminIndustryRepository) {
    this._industryRepository = industryRepository;
  }

  async findIndustryByName(name: string): Promise<IIndustry | null> {
    return this._industryRepository.findIndustryByName(name);
  }

  async findIndustryById(id: string): Promise<IIndustry | null> {
    return this._industryRepository.findById(id);
  }

  async addIndustry(name: string): Promise<IIndustry> {
    return this._industryRepository.create({ name });
  }

  async updateIndustry(id: string, name: string): Promise<IIndustry | null> {
    return this._industryRepository.update(id, { name });
  }

  async getAllIndustries(
    page: number,
    limit: number,
    search: string = ""
  ): Promise<{ data: IIndustry[]; total: number }> {
    return this._industryRepository.getAllIndustriesPaginated(page, limit, search);
  }

  async toggleActiveIndustry(id: string): Promise<IIndustry | null> {
    return this._industryRepository.toggleActive(id);
  }

  async deleteIndustry(id: string): Promise<boolean> {
    const result = await this._industryRepository.delete(id);
    return !!result;  // Convert to boolean
  }
}