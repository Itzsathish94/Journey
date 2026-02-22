import { IInterviewer } from "../../../models/interviewer-model";

export interface FilterOption {
  id: string;
  name: string;
}

export interface IUserInterviewerListingRepository {
  listinterviewerInterviewersPaginated(
    page: number,
    limit: number,
    search?: string,
    sortOrder?: "asc" | "desc",
    domainIds?: string[],
    skillIds?: string[],
    industryIds?: string[],
  ): Promise<{ data: IInterviewer[]; total: number }>;

  getinterviewerInterviewerById(id: string): Promise<IInterviewer | null>;

  getAvailableFilters(domainIds?: string[]): Promise<{
    domains: FilterOption[];
    skills: FilterOption[];
    industries: FilterOption[];
  }>;
}