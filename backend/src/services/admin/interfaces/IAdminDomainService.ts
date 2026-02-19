// src/services/admin/interfaces/IAdminDomainService.ts
import { IDomainModel } from "../../../models/category/domain-model";

export interface IAdminDomainService {
  findDomainByName(domainName: string): Promise<IDomainModel | null>;
  findDomainById(domainId: string): Promise<IDomainModel | null>;
  addDomain(domaiNname: string): Promise<IDomainModel>;
  updateDomain(domainId: string, domaiNname: string): Promise<IDomainModel | null>;
  getAllDomainsPaginated(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ data: IDomainModel[]; total: number }>;
  toggleActiveDomain(iddomainId: string): Promise<IDomainModel | null>;
  deleteDomain(domainId: string): Promise<boolean>;
}