import { IInterviewer } from "../../../models/interviewer-model";

export interface IAdminInterviewerRepository {
  getAllInterviewers(
    page: number,
    limit: number,
    search: string,
  ): Promise<{ interviewers: IInterviewer[]; total: number }>;

  getInterviewerData(email: string): Promise<IInterviewer | null>;

  updateInterviewerProfile(email: string, data: Partial<IInterviewer>): Promise<IInterviewer | null>;

  findById(id: string): Promise<IInterviewer | null>;
}