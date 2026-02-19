import DomainModel, { IDomainModel } from "../../models/category/domain-model";
import { GenericRepository } from "../generic-repository";
import { IAdminDomainRepository } from "./interfaces/IAdminDomainRepository";

export class AdminDomainRepository
  extends GenericRepository<IDomainModel>
  implements IAdminDomainRepository
{
  constructor() {
    super(DomainModel);
  }

  async getAllDomainsPaginated(
    page: number,
    limit: number,
    search: string = ""
  ): Promise<{ data: IDomainModel[]; total: number }> {
    const filter = search
      ? { domainName: { $regex: new RegExp(search, "i") } }
      : {};

    return await this.paginate(filter, page, limit, { domainName: 1 });
  }

  async findDomainByName(domainName: string): Promise<IDomainModel | null> {
    return this.findOne({
      domainName: { $regex: new RegExp(`^${domainName}$`, "i") },
    });
  }

  async toggleActive(domainId: string): Promise<IDomainModel | null> {
    const domain = await this.findById(domainId);
    if (!domain) {
      throw new Error("Domain not found");
    }

    return this.update(domainId, { isActive: !domain.isActive });
  }
}