// src/repositories/admin-repository/admin-skill-repository.ts
import SkillModel, { ISkillModel, ISkillPopulated } from "../../models/category/skill-model";
import { GenericRepository } from "../generic-repository";
import { IAdminSkillRepository } from "./interfaces/IAdminSkillRepository";

export class AdminSkillRepository
  extends GenericRepository<ISkillModel>
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
      filter.skillName = { $regex: new RegExp(search, "i") };
    }
    
    if (domainId) {
      filter.domainId = domainId;
    }
  
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      SkillModel.find(filter)
        .populate("domainId", "name")
        .sort({ skillName: 1 })
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
      .sort({ skillName: 1 })
      .lean<ISkillPopulated[]>();  // ✅ Uses your existing interface
  }

  async findSkillByName(skillName: string, domainId: string): Promise<ISkillModel | null> {
    return this.findOne({
      skillName: { $regex: new RegExp(`^${skillName}$`, "i") },
      domainId,
    });
  }

  async toggleActive(skillId: string): Promise<ISkillModel | null> {
    const skill = await this.findById(skillId);
    if (!skill) {
      throw new Error("Skill not found");
    }

    return this.update(skillId, { isActive: !skill.isActive });
  }
}