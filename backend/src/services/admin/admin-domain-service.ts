import { IAdminDomainService } from "./interfaces/IAdminDomainService";
import { IAdminDomainRepository } from "../../repositories/admin-repository/interfaces/IAdminDomainRepository";
import { IDomainModel } from "../../models/category/domain-model";

export class AdminDomainService implements IAdminDomainService {
  private _domainRepository: IAdminDomainRepository;

  constructor(domainRepository: IAdminDomainRepository) {
    this._domainRepository = domainRepository;
  }

  async findDomainByName(domainName: string): Promise<IDomainModel | null> {
    return this._domainRepository.findDomainByName(domainName);
  }

  async findDomainById(domainId: string): Promise<IDomainModel | null> {
    return this._domainRepository.findById(domainId);
  }

  async addDomain(domainName: string): Promise<IDomainModel> {
    return this._domainRepository.create({ domainName });
  }

  async updateDomain(domainId: string, domainName: string): Promise<IDomainModel | null> {
    return this._domainRepository.update(domainId, { domainName });
  }

  async getAllDomainsPaginated(
    page: number,
    limit: number,
    search: string = ""
  ): Promise<{ data: IDomainModel[]; total: number }> {
    return this._domainRepository.getAllDomainsPaginated(page, limit, search);
  }

  async toggleActiveDomain(domainId: string): Promise<IDomainModel | null> {
    return this._domainRepository.toggleActive(domainId);
  }

  async deleteDomain(domainId: string): Promise<boolean> {
    const result = await this._domainRepository.delete(domainId);
    return !!result;  // Convert to boolean
  }
}