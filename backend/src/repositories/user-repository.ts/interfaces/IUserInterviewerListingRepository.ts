import { IInterviewer } from "../../../models/interviewer-model";

export interface IUserInterviewerListingRepository {
  listinterviewerInterviewersPaginated(
    page: number,
    limit: number,
    search?: string,
    sortOrder?: "asc" | "desc",
    domainId?: string,
    skillId?: string,
    industryId?: string,
  ): Promise<{ data: IInterviewer[]; total: number }>;

  getinterviewerInterviewerById(id: string): Promise<IInterviewer | null>;

  getAvailableSkillsAndExpertise(): Promise<{
    skills: string[];
    expertise: string[];
  }>;
}