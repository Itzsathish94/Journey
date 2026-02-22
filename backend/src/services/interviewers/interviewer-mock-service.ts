import { Types } from "mongoose";
import InterviewerModel, { IMockOffering } from "../../models/interviewer-model";
import DomainModel from "../../models/category/domain-model";
import SkillModel from "../../models/category/skill-model";
import IndustryModel from "../../models/category/industry-model";
import { IInterviewerMockRepository } from "../../repositories/interviewer-repository/interfaces/IInterviewerMockRepository";
import IInterviewerService from "./interfaces/IInterviewerService";
import { IInterviewerMockService } from "./interfaces/IInterviewerMockService";
import { ForbiddenError, NotFoundError, BadRequestError } from "../../utils/error-handler";
import { InterviewerErrorMessages } from "../../utils/constants";
import { appLogger } from "../../utils/logger";
import { DifficultyLevel } from "../../models/interviewer-model";

export class InterviewerMockService implements IInterviewerMockService {
  private _mockRepo: IInterviewerMockRepository;
  private _interviewerService: IInterviewerService;

  constructor(
    mockRepo: IInterviewerMockRepository,
    interviewerService: IInterviewerService,
  ) {
    this._mockRepo = mockRepo;
    this._interviewerService = interviewerService;
  }

  private async ensureVerified(interviewerId: string) {
    const interviewer = await this._interviewerService.findById(interviewerId);
    if (!interviewer) {
      throw new NotFoundError(InterviewerErrorMessages.INTERVIEWER_NOT_FOUND);
    }
    if (!interviewer.isVerified) {
      throw new ForbiddenError(InterviewerErrorMessages.UNAUTHORIZED);
    }
    return interviewer;
  }

  // signature = domainId|sortedSkillIds|sortedIndustryIds
  private buildSignature(domainId: string, skillIds: string[], industryIds: string[]) {
    const normalize = (ids: string[]) => [...new Set(ids.map(String))].sort();
    return `${String(domainId)}|${normalize(skillIds).join(",")}|${normalize(industryIds).join(",")}`;
  }

  // Auto-sync profile categories from ACTIVE mocks (IDs only)
  private async syncProfileCategories(interviewerId: string): Promise<void> {
    const interviewer = await InterviewerModel.findById(interviewerId).select("offerings domains skills industries");
    if (!interviewer) return;

    const activeMocks = interviewer.offerings.filter((m) => m.isActive);

    const uniqueDomains = [...new Set(activeMocks.map((m) => m.domainId.toString()))];
    const uniqueSkills = [
      ...new Set(activeMocks.flatMap((m) => m.skillIds.map((s) => s.toString()))),
    ];
    const uniqueIndustries = [
      ...new Set(activeMocks.flatMap((m) => m.industryIds.map((i) => i.toString()))),
    ];

    interviewer.domains = uniqueDomains.map((id) => new Types.ObjectId(id));
    interviewer.skills = uniqueSkills.map((id) => new Types.ObjectId(id));
    interviewer.industries = uniqueIndustries.map((id) => new Types.ObjectId(id));

    await interviewer.save();
  }

  async getMyOfferings(interviewerId: string): Promise<IMockOffering[]> {
    await this.ensureVerified(interviewerId);
    return this._mockRepo.getMockOfferings(interviewerId);
  }

  // ✅ return ONLY created offering
  async createOffering(
    interviewerId: string,
    payload: {
      domainId: string;
      skillIds: string[];
      industryIds: string[];
      difficultyLevels: {
        level: "entry" | "mid" | "senior" | "jobDescription";
        price: number;
      }[];
    },
  ): Promise<IMockOffering> {
    await this.ensureVerified(interviewerId);

    if (
      !payload.domainId ||
      !payload.skillIds?.length ||
      !payload.industryIds?.length ||
      !payload.difficultyLevels?.length
    ) {
      throw new BadRequestError(InterviewerErrorMessages.INVALID_DATA);
    }

    // Validate ObjectIds
    if (!Types.ObjectId.isValid(payload.domainId)) throw new BadRequestError("Invalid domainId");
    if (payload.skillIds.some((id) => !Types.ObjectId.isValid(id))) throw new BadRequestError("Invalid skillIds");
    if (payload.industryIds.some((id) => !Types.ObjectId.isValid(id))) throw new BadRequestError("Invalid industryIds");

    // Validate active status
    const domain = await DomainModel.findById(payload.domainId).select("isActive");
    if (!domain) throw new BadRequestError("Domain not found");
    if (!domain.isActive) throw new BadRequestError("Cannot use inactive domain");

    const skills = await SkillModel.find({ _id: { $in: payload.skillIds } }).select("isActive");
    if (skills.length !== payload.skillIds.length) throw new BadRequestError("One or more skills not found");
    if (skills.some((s) => !s.isActive)) throw new BadRequestError("Cannot use inactive skill(s)");

    const industries = await IndustryModel.find({ _id: { $in: payload.industryIds } }).select("isActive");
    if (industries.length !== payload.industryIds.length) throw new BadRequestError("One or more industries not found");
    if (industries.some((i) => !i.isActive)) throw new BadRequestError("Cannot use inactive industry(s)");

    // ✅ Duplicate check by signature
    const signature = this.buildSignature(payload.domainId, payload.skillIds, payload.industryIds);
    const existing = await this._mockRepo.getMockOfferings(interviewerId);
    if (existing.some((o) => o.signature === signature)) {
      throw new BadRequestError("This mock combination already exists");
    }

    const updated = await this._mockRepo.addMockOffering(interviewerId, {
      domainId: new Types.ObjectId(payload.domainId),
      skillIds: payload.skillIds.map((id) => new Types.ObjectId(id)),
      industryIds: payload.industryIds.map((id) => new Types.ObjectId(id)),
      signature,
      difficultyLevels: payload.difficultyLevels,
      isActive: true,
    });

    if (!updated) throw new Error(InterviewerErrorMessages.OFFERING_NOT_CREATED);

    await this.syncProfileCategories(interviewerId);

    // created one is the last pushed item
    const createdOffering = updated.offerings[updated.offerings.length - 1];
    if (!createdOffering) throw new Error(InterviewerErrorMessages.OFFERING_NOT_CREATED);

    return createdOffering;
  }

  async updateOffering(
    interviewerId: string,
    mockId: string,
    update: { difficultyLevels: { level: DifficultyLevel; price: number }[] },
  ): Promise<IMockOffering> {
    await this.ensureVerified(interviewerId);
  
    if (!Types.ObjectId.isValid(mockId)) {
      throw new BadRequestError("Invalid mockId");
    }
  
    // Only allow difficultyLevels
    if (!update?.difficultyLevels?.length) {
      throw new BadRequestError("difficultyLevels is required");
    }
  
    // (Optional) validate duplicates inside difficultyLevels (same level twice)
    const levels = update.difficultyLevels.map(d => d.level);
    const uniqueLevels = new Set(levels);
    if (uniqueLevels.size !== levels.length) {
      throw new BadRequestError("Duplicate difficulty level found");
    }
  
    // Ensure the mock exists first (clean 404)
    const offerings = await this._mockRepo.getMockOfferings(interviewerId);
    const current = offerings.find((o) => o._id?.toString() === mockId);
    if (!current) {
      throw new NotFoundError(InterviewerErrorMessages.MOCK_OFFERING_NOT_FOUND);
    }
  
    // Patch only difficultyLevels (NO domain/skills/industries/signature/isActive)
    const patch: Partial<IMockOffering> = {
      difficultyLevels: update.difficultyLevels as any,
    };
  
    const updatedInterviewer = await this._mockRepo.updateMockOffering(
      interviewerId,
      mockId,
      patch,
    );
  
    if (!updatedInterviewer) {
      throw new Error("Failed to update mock offering");
    }
  
    // keep profile sync logic (active mocks only)
    await this.syncProfileCategories(interviewerId);
  
    const updatedOffering = updatedInterviewer.offerings.find(
      (o) => o._id?.toString() === mockId,
    );
  
    if (!updatedOffering) {
      throw new NotFoundError(InterviewerErrorMessages.MOCK_OFFERING_NOT_FOUND);
    }
  
    return updatedOffering;
  }

  // ✅ return ONLY toggled offering
  async toggleOffering(
    interviewerId: string,
    mockId: string,
    isActive: boolean,
  ): Promise<IMockOffering> {
    await this.ensureVerified(interviewerId);

    if (typeof isActive !== "boolean") {
      throw new BadRequestError("isActive must be a boolean value");
    }

    const updated = await this._mockRepo.toggleMockActive(interviewerId, mockId, isActive);
    if (!updated) throw new NotFoundError(InterviewerErrorMessages.MOCK_OFFERING_NOT_FOUND);

    await this.syncProfileCategories(interviewerId);

    const toggled = updated.offerings.find((o) => o._id?.toString() === mockId);
    if (!toggled) throw new NotFoundError(InterviewerErrorMessages.MOCK_OFFERING_NOT_FOUND);

    appLogger.info(
      `Mock offering ${mockId} ${isActive ? "activated" : "deactivated"} by interviewer ${interviewerId}`,
    );

    return toggled;
  }
}