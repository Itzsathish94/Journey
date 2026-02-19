import { IInterviewer } from "../../../models/interviewer-model";

export interface IUserInterviewerListingService {
  getPaginatedinterviewers(
    page: number,
    limit: number,
    search?: string,
    sortOrder?: "asc" | "desc",
    skill?: string,
    expertise?: string,
  ): Promise<{ data: IInterviewer[]; total: number }>;

  getinterviewerById(id: string): Promise<IInterviewer | null>;

  getAvailableFilters(): Promise<{ skills: string[]; expertise: string[] }>;
}