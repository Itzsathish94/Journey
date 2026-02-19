// src/repositories/admin-repository/admin-industry-repository.ts
import IndustryModel, { IIndustryModel } from "../../models/category/industry-model";
import { GenericRepository } from "../generic-repository";
import { IAdminIndustryRepository } from "./interfaces/IAdminIndustryRepository";

export class AdminIndustryRepository
  extends GenericRepository<IIndustryModel>
  implements IAdminIndustryRepository
{
  constructor() {
    super(IndustryModel);
  }

  async getAllIndustriesPaginated(
    page: number,
    limit: number,
    search: string = ""
  ): Promise<{ data: IIndustryModel[]; total: number }> {
    const filter = search
      ? { name: { $regex: new RegExp(search, "i") } }
      : {};

    return await this.paginate(filter, page, limit, { name: 1 });
  }

  async findIndustryByName(industryName: string): Promise<IIndustryModel | null> {
    return this.findOne({
      industryName: { $regex: new RegExp(`^${industryName}$`, "i") },
    });
  }

  async toggleActive(industryId: string): Promise<IIndustryModel | null> {
    const industry = await this.findById(industryId);
    if (!industry) {
      throw new Error("Industry not found");
    }

    return this.update(industryId, { isActive: !industry.isActive });
  }
}