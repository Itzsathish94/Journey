import { IInterviewer } from "../../../models/interviewer-model";

export interface IUserInterviewerListingService {
  getPaginatedinterviewers(
    page: number,
    limit: number,
    search?: string,
    sortOrder?: "asc" | "desc",
    domainId?: string,
    skillId?: string,
    industryId?: string,
  ): Promise<{ data: IInterviewer[]; total: number }>;

  getinterviewerById(id: string): Promise<IInterviewer | null>;

  getAvailableFilters(): Promise<{ skills: string[]; expertise: string[] }>;
}