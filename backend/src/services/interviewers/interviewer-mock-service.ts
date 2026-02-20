import { IMockOffering } from "../../models/interviewer-model";
import { IInterviewerMockRepository } from "../../repositories/interviewer-repository/interfaces/IInterviewerMockRepository";
import IInterviewerService from "./interfaces/IInterviewerService";
import { IInterviewerMockService } from "./interfaces/IInterviewerMockService";
import {
  ForbiddenError,
  NotFoundError,
  BadRequestError,
} from "../../utils/error-handler";
import { InterviewerErrorMessages } from "../../utils/constants";

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

  async getMyOfferings(interviewerId: string): Promise<IMockOffering[]> {
    await this.ensureVerified(interviewerId);
    return await this._mockRepo.getMockOfferings(interviewerId);
  }

  async createOffering(
    interviewerId: string,
    payload: {
      domainId: string;
      skillIds: string[];
      industryIds: string[];
      difficultyLevels: {
        level: "entry" | "mid" | "senior" | "job_desc_only";
        duration?: number;
        price: number;
      }[];
    },
  ): Promise<IMockOffering[]> {
    await this.ensureVerified(interviewerId);

    if (
      !payload.domainId ||
      !payload.skillIds?.length ||
      !payload.industryIds?.length ||
      !payload.difficultyLevels?.length
    ) {
      throw new BadRequestError(InterviewerErrorMessages.INVALID_DATA);
    }

    const normalizedLevels = payload.difficultyLevels.map((level) => ({
      ...level,
      duration: level.duration ?? 60,
    }));

    const updated = await this._mockRepo.addMockOffering(interviewerId, {
      domainId: payload.domainId as any,
      skillIds: payload.skillIds as any,
      industryIds: payload.industryIds as any,
      difficultyLevels: normalizedLevels,
      isActive: true,
    });

    return updated?.offerings || [];
  }

  async updateOffering(
    interviewerId: string,
    mockId: string,
    update: Partial<IMockOffering>,
  ): Promise<IMockOffering[]> {
    await this.ensureVerified(interviewerId);

    const patch: Partial<IMockOffering> = { ...update };

    if (update.difficultyLevels) {
      patch.difficultyLevels = update.difficultyLevels.map((level) => ({
        ...level,
        duration: level.duration ?? 60,
      }));
    }

    const updated = await this._mockRepo.updateMockOffering(
      interviewerId,
      mockId,
      patch,
    );

    return updated?.offerings || [];
  }

  async toggleOffering(
    interviewerId: string,
    mockId: string,
    isActive: boolean,
  ): Promise<IMockOffering[]> {
    await this.ensureVerified(interviewerId);

    const updated = await this._mockRepo.toggleMockActive(
      interviewerId,
      mockId,
      isActive,
    );

    return updated?.offerings || [];
  }
}

