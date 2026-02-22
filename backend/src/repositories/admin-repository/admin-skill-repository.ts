// src/repositories/admin-repository/admin-skill-repository.ts
import SkillModel, { ISkillModel } from "../../models/category/skill-model";
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
    search: string = ""
  ): Promise<{ data: ISkillModel[]; total: number }> {
    const filter: any = {};
    
    if (search) {
      filter.skillName = { $regex: new RegExp(search, "i") };
    }
  
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      SkillModel.find(filter)
        .sort({ skillName: 1 })
        .skip(skip)
        .limit(limit)
        .lean<ISkillModel[]>(),
      SkillModel.countDocuments(filter),
    ]);
  
    return { data, total };
  }

  async findSkillByName(skillName: string): Promise<ISkillModel | null> {
    return this.findOne({
      skillName: { $regex: new RegExp(`^${skillName}$`, "i") },
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