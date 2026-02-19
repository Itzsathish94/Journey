import { IUserInterviewerListingRepository } from "./interfaces/IUserInterviewerListingRepository";
import InterviewerModel, { IInterviewer } from "../../models/interviewer-model";
import { GenericRepository } from "../generic-repository";
import { FilterQuery, PipelineStage } from "mongoose";

export class UserInterviewerListingRepository
  extends GenericRepository<IInterviewer>
  implements IUserInterviewerListingRepository
{
  constructor() {
    super(InterviewerModel);
  }

  async listinterviewerInterviewersPaginated(
    page: number,
    limit: number,
    search?: string,
    sortOrder: "asc" | "desc" = "asc",
    skill?: string,
    expertise?: string,
  ): Promise<{ data: IInterviewer[]; total: number }> {
    const match: FilterQuery<IInterviewer> = {
      isVerified: true,  // ✅ Changed from isinterviewer
      isBlocked: false,
    };

    if (search) {
      match.username = { $regex: search, $options: "i" };
    }

    if (skill) {
      match.skills = skill;
    }

    if (expertise) {
      match.expertise = expertise;
    }

    const pipeline: PipelineStage[] = [
      { $match: match },
      {
        $addFields: {
          usernameLower: { $toLower: "$username" },
        },
      },
      {
        $sort: {
          usernameLower: sortOrder === "desc" ? -1 : 1,
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ];

    const [data, total] = await Promise.all([
      this.aggregate<IInterviewer>(pipeline),
      this.countDocuments(match),
    ]);

    return { data, total };
  }

  async getinterviewerInterviewerById(id: string): Promise<IInterviewer | null> {
    return await this.findOne({ _id: id, isVerified: true, isBlocked: false });  // ✅ Changed
  }

  async getAvailableSkillsAndExpertise(): Promise<{
    skills: string[];
    expertise: string[];
  }> {
    const skillsPipeline: PipelineStage[] = [
      { $match: { isVerified: true, isBlocked: false } },  // ✅ Changed
      { $unwind: "$skills" },
      { $group: { _id: "$skills" } },
      { $project: { _id: 0, skill: "$_id" } },
    ];

    const expertisePipeline: PipelineStage[] = [
      { $match: { isVerified: true, isBlocked: false } },  // ✅ Changed
      { $unwind: "$expertise" },
      { $group: { _id: "$expertise" } },
      { $project: { _id: 0, expertise: "$_id" } },
    ];

    const [skillsResult, expertiseResult] = await Promise.all([
      this.aggregate<{ skill: string }>(skillsPipeline),
      this.aggregate<{ expertise: string }>(expertisePipeline),
    ]);

    return {
      skills: skillsResult.map((s) => s.skill),
      expertise: expertiseResult.map((e) => e.expertise),
    };
  }
}