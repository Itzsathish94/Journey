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
      const domainId = req.query.domain as string | undefined;
      const skillId = req.query.skill as string | undefined;
      const industryId = req.query.industry as string | undefined;

      const result = await this._interviewerListingService.getPaginatedinterviewers(
        page,
        limit,
        search,
        sort,
        domainId,
        skillId,
        industryId,
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

  async getAvailableFilters(_req: Request, res: Response): Promise<void> {
    try {
      const filters =
        await this._interviewerListingService.getAvailableFilters();
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