// src/repositories/admin-repository/admin-industry-repository.ts
import IndustryModel, { IIndustry } from "../../models/category/industry-model";
import { GenericRepository } from "../generic-repository";
import { IAdminIndustryRepository } from "./interfaces/IAdminIndustryRepository";

export class AdminIndustryRepository
  extends GenericRepository<IIndustry>
  implements IAdminIndustryRepository
{
  constructor() {
    super(IndustryModel);
  }

  async getAllIndustriesPaginated(
    page: number,
    limit: number,
    search: string = ""
  ): Promise<{ data: IIndustry[]; total: number }> {
    const filter = search
      ? { name: { $regex: new RegExp(search, "i") } }
      : {};

    return await this.paginate(filter, page, limit, { name: 1 });
  }

  async findIndustryByName(name: string): Promise<IIndustry | null> {
    return this.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
  }

  async toggleActive(id: string): Promise<IIndustry | null> {
    const industry = await this.findById(id);
    if (!industry) {
      throw new Error("Industry not found");
    }

    return this.update(id, { isActive: !industry.isActive });
  }
}