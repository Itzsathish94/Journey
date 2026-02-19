// src/repositories/admin-repository/admin-skill-repository.ts
import SkillModel, { ISkill, ISkillPopulated } from "../../models/category/skill-model";
import { GenericRepository } from "../generic-repository";
import { IAdminSkillRepository } from "./interfaces/IAdminSkillRepository";

export class AdminSkillRepository
  extends GenericRepository<ISkill>
  implements IAdminSkillRepository
{
  constructor() {
    super(SkillModel);
  }

  async getAllSkillsPaginated(
    page: number,
    limit: number,
    search: string = "",
    domainId?: string
  ): Promise<{ data: ISkillPopulated[]; total: number }> {
    const filter: any = {};
    
    if (search) {
      filter.name = { $regex: new RegExp(search, "i") };
    }
    
    if (domainId) {
      filter.domainId = domainId;
    }
  
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      SkillModel.find(filter)
        .populate("domainId", "name")
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit)
        .lean<ISkillPopulated[]>(),  // ✅ Clean type assertion
      SkillModel.countDocuments(filter),
    ]);
  
    return { data, total };
  }

  async getSkillsByDomainId(domainId: string): Promise<ISkillPopulated[]> {
    return await SkillModel.find({ domainId })
      .populate("domainId", "name")
      .sort({ name: 1 })
      .lean<ISkillPopulated[]>();  // ✅ Uses your existing interface
  }

  async findSkillByName(name: string, domainId: string): Promise<ISkill | null> {
    return this.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      domainId,
    });
  }

  async toggleActive(id: string): Promise<ISkill | null> {
    const skill = await this.findById(id);
    if (!skill) {
      throw new Error("Skill not found");
    }

    return this.update(id, { isActive: !skill.isActive });
  }
}