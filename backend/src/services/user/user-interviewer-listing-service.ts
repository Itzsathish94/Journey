import { IUserInterviewerListingService } from "./interfaces/IUserInterviewerListingService";
import { IUserInterviewerListingRepository } from "../../repositories/user-repository.ts/interfaces/IUserInterviewerListingRepository";
import { IInterviewer } from "../../models/interviewer-model";
import { getPresignedUrl } from "../../utils/get-presigned-url";

export class UserInterviewerListingService
  implements IUserInterviewerListingService
{
  private _interviewerListingRepo: IUserInterviewerListingRepository;

  constructor(repo: IUserInterviewerListingRepository) {
    this._interviewerListingRepo = repo;
  }

  async getPaginatedinterviewers(
    page: number,
    limit: number,
    search?: string,
    sortOrder?: "asc" | "desc",
    skill?: string,
    expertise?: string,
  ): Promise<{ data: IInterviewer[]; total: number }> {
    const { data, total } =
      await this._interviewerListingRepo.listinterviewerInterviewersPaginated(
        page,
        limit,
        search,
        sortOrder,
        skill,
        expertise,
      );

    const updatedData = await Promise.all(
      data.map(async (interviewer) => {
        if (interviewer.profilePicUrl) {
          interviewer.profilePicUrl = await getPresignedUrl(interviewer.profilePicUrl);
        }
        return interviewer;
      }),
    );

    return { data: updatedData as IInterviewer[], total };
  }

  async getinterviewerById(id: string): Promise<IInterviewer | null> {
    const interviewer =
      await this._interviewerListingRepo.getinterviewerInterviewerById(id);
    if (!interviewer) return null;

    const interviewerObj = interviewer.toObject();
    if (interviewer.profilePicUrl) {
      interviewerObj.profilePicUrl = await getPresignedUrl(interviewer.profilePicUrl);
    }
    return interviewerObj as IInterviewer;
  }

  async getAvailableFilters(): Promise<{
    skills: string[];
    expertise: string[];
  }> {
    return await this._interviewerListingRepo.getAvailableSkillsAndExpertise();
  }
}