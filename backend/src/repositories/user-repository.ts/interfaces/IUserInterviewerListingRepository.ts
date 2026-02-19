import { IInterviewer } from "../../../models/interviewer-model";

export interface IUserInterviewerListingRepository {
  listinterviewerInterviewersPaginated(
    page: number,
    limit: number,
    search?: string,
    sortOrder?: "asc" | "desc",
    skill?: string,
    expertise?: string,
  ): Promise<{ data: IInterviewer[]; total: number }>;

  getinterviewerInterviewerById(id: string): Promise<IInterviewer | null>;

  getAvailableSkillsAndExpertise(): Promise<{
    skills: string[];
    expertise: string[];
  }>;
}