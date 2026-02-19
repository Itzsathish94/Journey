// src/repositories/admin-repository/interfaces/IAdminDomainRepository.ts
import { IDomainModel } from "../../../models/category/domain-model";
import { IGenericRepository } from "../../generic-repository";

export interface IAdminDomainRepository extends IGenericRepository<IDomainModel> {
  findDomainByName(domainName: string): Promise<IDomainModel | null>;
  toggleActive(domainId: string): Promise<IDomainModel | null>;
  getAllDomainsPaginated(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ data: IDomainModel[]; total: number }>;
}