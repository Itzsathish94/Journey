import { IUserInterviewerListingRepository, FilterOption } from "./interfaces/IUserInterviewerListingRepository";
import InterviewerModel, { IInterviewer } from "../../models/interviewer-model";
import DomainModel from "../../models/category/domain-model";
import SkillModel from "../../models/category/skill-model";
import IndustryModel from "../../models/category/industry-model";
import { GenericRepository } from "../generic-repository";
import { FilterQuery, PipelineStage, Types } from "mongoose";

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
    domainIds?: string[],
    skillIds?: string[],
    industryIds?: string[],
  ): Promise<{ data: IInterviewer[]; total: number }> {
    const domainOids =
      domainIds?.length && domainIds.every((id) => Types.ObjectId.isValid(id))
        ? domainIds.map((id) => new Types.ObjectId(id))
        : null;
    const skillOids =
      skillIds?.length && skillIds.every((id) => Types.ObjectId.isValid(id))
        ? skillIds.map((id) => new Types.ObjectId(id))
        : [];
    const industryOids =
      industryIds?.length && industryIds.every((id) => Types.ObjectId.isValid(id))
        ? industryIds.map((id) => new Types.ObjectId(id))
        : [];

    const baseMatch: FilterQuery<IInterviewer> = {
      isVerified: true,
      isBlocked: false,
      "offerings.0": { $exists: true },
    };
    if (search) {
      baseMatch.username = { $regex: search, $options: "i" };
    }

    const domainCond = domainOids?.length
      ? { $in: ["$$o.domainId", domainOids] }
      : { $ne: [1, 0] };

    const [result] = await this.model.aggregate<{ data: IInterviewer[]; total: { count: number }[] }>([
      { $match: baseMatch },
      {
        $addFields: {
          matchingOfferings: {
            $filter: {
              input: "$offerings",
              as: "o",
              cond: {
                $and: [{ $eq: ["$$o.isActive", true] }, domainCond],
              },
            },
          },
        },
      },
      { $match: { $expr: { $gt: [{ $size: "$matchingOfferings" }, 0] } } },
      {
        $facet: {
          total: [{ $count: "count" }],
          data: [
            {
              $addFields: {
                bestScore: {
                  $max: {
                    $map: {
                      input: "$matchingOfferings",
                      as: "o",
                      in: {
                        $add: [
                          { $multiply: [{ $size: { $setIntersection: ["$$o.skillIds", skillOids] } }, 10] },
                          { $size: { $setIntersection: ["$$o.industryIds", industryOids] } },
                        ],
                      },
                    },
                  },
                },
              },
            },
            {
              $addFields: {
                usernameLower: { $toLower: "$username" },
              },
            },
            {
              $sort: {
                bestScore: -1,
                usernameLower: sortOrder === "desc" ? -1 : 1,
              },
            },
            { $skip: (page - 1) * limit },
            { $limit: limit },
            { $project: { matchingOfferings: 0, bestScore: 0, usernameLower: 0 } },
          ],
        },
      },
    ]).exec();

    const data = result?.data ?? [];
    const total = result?.total?.[0]?.count ?? 0;

    return { data, total };
  }

  async getinterviewerInterviewerById(id: string): Promise<IInterviewer | null> {
    return await this.findOne({ _id: id, isVerified: true, isBlocked: false });
  }

  async getAvailableFilters(domainIds?: string[]): Promise<{
    domains: FilterOption[];
    skills: FilterOption[];
    industries: FilterOption[];
  }> {
    const domainOids =
      domainIds?.length && domainIds.every((id) => Types.ObjectId.isValid(id))
        ? domainIds.map((id) => new Types.ObjectId(id))
        : null;

    if (domainOids?.length) {
      const baseStages: PipelineStage[] = [
        { $match: { isVerified: true, isBlocked: false, "offerings.0": { $exists: true } } },
        { $unwind: "$offerings" },
        {
          $match: {
            "offerings.isActive": true,
            "offerings.domainId": { $in: domainOids },
          },
        },
      ];

      const [skillsResult, industriesResult] = await Promise.all([
        this.model.aggregate<{ _id: Types.ObjectId }>([
          ...baseStages,
          { $unwind: "$offerings.skillIds" },
          { $group: { _id: "$offerings.skillIds" } },
        ]).exec(),
        this.model.aggregate<{ _id: Types.ObjectId }>([
          ...baseStages,
          { $unwind: "$offerings.industryIds" },
          { $group: { _id: "$offerings.industryIds" } },
        ]).exec(),
      ]);

      const skillIds = skillsResult.map((r) => r._id);
      const industryIds = industriesResult.map((r) => r._id);

      const [domains, skills, industries] = await Promise.all([
        DomainModel.find({ _id: { $in: domainOids }, isActive: true })
          .select("_id domainName")
          .lean(),
        skillIds.length
          ? SkillModel.find({ _id: { $in: skillIds }, isActive: true })
              .select("_id skillName")
              .lean()
          : [],
        industryIds.length
          ? IndustryModel.find({ _id: { $in: industryIds }, isActive: true })
              .select("_id industryName")
              .lean()
          : [],
      ]);

      return {
        domains: domains.map((d) => ({ id: d._id.toString(), name: d.domainName })),
        skills: skills.map((s) => ({ id: s._id.toString(), name: s.skillName })),
        industries: industries.map((i) => ({ id: i._id.toString(), name: i.industryName })),
      };
    }

    const [domains, skills, industries] = await Promise.all([
      DomainModel.find({ isActive: true }).select("_id domainName").lean(),
      SkillModel.find({ isActive: true }).select("_id skillName").lean(),
      IndustryModel.find({ isActive: true }).select("_id industryName").lean(),
    ]);

    return {
      domains: domains.map((d) => ({ id: d._id.toString(), name: d.domainName })),
      skills: skills.map((s) => ({ id: s._id.toString(), name: s.skillName })),
      industries: industries.map((i) => ({ id: i._id.toString(), name: i.industryName })),
    };
  }
}