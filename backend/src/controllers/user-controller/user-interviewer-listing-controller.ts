import { IUserInterviewerListingController } from "./interfaces/IUserInterviewerListingController";
import { IUserInterviewerListingService } from "../../services/user/interfaces/IUserInterviewerListingService";
import { Request, Response } from "express";
import { StatusCode } from "../../utils/enum";
import { UserErrorMessages } from "../../utils/constants";
import { appLogger } from "../../utils/logger";

export class UserInterviewerListingController
  implements IUserInterviewerListingController
{
  private _interviewerListingService: IUserInterviewerListingService;

  constructor(interviewerListingService: IUserInterviewerListingService) {
    this._interviewerListingService = interviewerListingService;
  }

  async listinterviewers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 9;
      const search = req.query.search as string | undefined;
      const sort = (req.query.sort as "asc" | "desc") || "asc";

      const toArray = (v: unknown): string[] => {
        if (!v) return [];
        if (Array.isArray(v)) return v.filter((x) => typeof x === "string");
        if (typeof v === "string") return v.includes(",") ? v.split(",").map((s) => s.trim()) : [v];
        return [];
      };
      const domainIds = toArray(req.query.domains);
      const skillIds = toArray(req.query.skills);
      const industryIds = toArray(req.query.industries);

      const result = await this._interviewerListingService.getPaginatedinterviewers(
        page,
        limit,
        search,
        sort,
        domainIds.length ? domainIds : undefined,
        skillIds.length ? skillIds : undefined,
        industryIds.length ? industryIds : undefined,
      );

      res.status(StatusCode.OK).json({ success: true, ...result });
    } catch (error) {
      appLogger.error("error in list interviewers", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: UserErrorMessages.FAILED_TO_LIST_INTERVIEWER,
      });
    }
  }

  async getinterviewerById(req: Request, res: Response): Promise<void> {
    try {
      const { interviewerId } = req.params;
      const interviewer =
        await this._interviewerListingService.getinterviewerById(interviewerId);

      if (!interviewer) {
        res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: UserErrorMessages.INTERVIEWER_NOT_FOUND,
        });
        return;
      }

      res.status(StatusCode.OK).json({ success: true, data: interviewer });
    } catch (error) {
      appLogger.error("error in get interviewer", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: UserErrorMessages.FAILED_TO_FETCH_INTERVIEWER_DETAIL,
      });
    }
  }

  async getAvailableFilters(req: Request, res: Response): Promise<void> {
    try {
      const toArray = (v: unknown): string[] => {
        if (!v) return [];
        if (Array.isArray(v)) return v.filter((x) => typeof x === "string");
        if (typeof v === "string") return v.includes(",") ? v.split(",").map((s) => s.trim()) : [v];
        return [];
      };
      const domainIds = toArray(req.query.domains);
      const filters = await this._interviewerListingService.getAvailableFilters(
        domainIds.length ? domainIds : undefined,
      );
      res.status(StatusCode.OK).json({ success: true, ...filters });
    } catch (error) {
      appLogger.error("error in filters", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: UserErrorMessages.FAILED_TO_FETCH_FILTER_OPTION,
      });
    }
  }
}