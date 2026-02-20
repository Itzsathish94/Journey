import { Response } from "express";
import { AuthenticatedRequest } from "../../middlewares/authenticated-routes";
import { StatusCode } from "../../utils/enum";
import { appLogger } from "../../utils/logger";
import { handleControllerError } from "../../utils/error-handler";
import { IInterviewerMockService } from "../../services/interviewers/interfaces/IInterviewerMockService";
import { IInterviewerMockController } from "./interfaces/IInterviewerMockController";
import { IMockOffering } from "../../models/interviewer-model";

const mapOffering = (offering: IMockOffering) => ({
  mockId: offering._id,
  domainId: offering.domainId,
  skillIds: offering.skillIds,
  industryIds: offering.industryIds,
  difficultyLevels: offering.difficultyLevels,
  isActive: offering.isActive,
});

export class InterviewerMockController implements IInterviewerMockController {
  private _mockService: IInterviewerMockService;

  constructor(mockService: IInterviewerMockService) {
    this._mockService = mockService;
  }

  async getMyMocks(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const interviewerId = req.user?.id;
      if (!interviewerId) {
        res.status(StatusCode.FORBIDDEN).json({
          success: false,
          message: "Unauthorized: Interviewer ID missing.",
        });
        return;
      }

      const offerings = await this._mockService.getMyOfferings(interviewerId);
      res.status(StatusCode.OK).json({
        success: true,
        data: offerings.map(mapOffering),
      });
    } catch (error) {
      appLogger.error("Error in getMyMocks", error);
      handleControllerError(error, res);
    }
  }

  async createMock(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const interviewerId = req.user?.id;
      if (!interviewerId) {
        res.status(StatusCode.FORBIDDEN).json({
          success: false,
          message: "Unauthorized: Interviewer ID missing.",
        });
        return;
      }

      const {
        domainId,
        skillIds,
        industryIds,
        difficultyLevels,
      } = req.body as {
        domainId: string;
        skillIds: string[];
        industryIds: string[];
        difficultyLevels: {
          level: "entry" | "mid" | "senior" | "job_desc_only";
          duration?: number;
          price: number;
        }[];
      };

      const offerings = await this._mockService.createOffering(
        interviewerId,
        {
          domainId,
          skillIds,
          industryIds,
          difficultyLevels,
        },
      );

      res.status(StatusCode.CREATED).json({
        success: true,
        data: offerings.map(mapOffering),
      });
    } catch (error) {
      appLogger.error("Error in createMock", error);
      handleControllerError(error, res);
    }
  }

  async updateMock(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const interviewerId = req.user?.id;
      const { mockId } = req.params;

      if (!interviewerId) {
        res.status(StatusCode.FORBIDDEN).json({
          success: false,
          message: "Unauthorized: Interviewer ID missing.",
        });
        return;
      }

      const {
        domainId,
        skillIds,
        industryIds,
        difficultyLevels,
        isActive,
      } = req.body as Partial<{
        domainId: string;
        skillIds: string[];
        industryIds: string[];
        difficultyLevels: {
          level: "entry" | "mid" | "senior" | "job_desc_only";
          duration?: number;
          price: number;
        }[];
        isActive: boolean;
      }>;

      const offerings = await this._mockService.updateOffering(
        interviewerId,
        mockId,
        {
          domainId: domainId as any,
          skillIds: skillIds as any,
          industryIds: industryIds as any,
          difficultyLevels,
          isActive,
        },
      );

      res.status(StatusCode.OK).json({
        success: true,
        data: offerings.map(mapOffering),
      });
    } catch (error) {
      appLogger.error("Error in updateMock", error);
      handleControllerError(error, res);
    }
  }

  async toggleMock(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const interviewerId = req.user?.id;
      const { mockId } = req.params;
      const { isActive } = req.body as { isActive: boolean };

      if (!interviewerId) {
        res.status(StatusCode.FORBIDDEN).json({
          success: false,
          message: "Unauthorized: Interviewer ID missing.",
        });
        return;
      }

      const offerings = await this._mockService.toggleOffering(
        interviewerId,
        mockId,
        isActive,
      );

      res.status(StatusCode.OK).json({
        success: true,
        data: offerings.map(mapOffering),
      });
    } catch (error) {
      appLogger.error("Error in toggleMock", error);
      handleControllerError(error, res);
    }
  }
}

