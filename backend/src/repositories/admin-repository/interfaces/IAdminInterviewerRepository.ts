import { IInterviewerModel } from "../../../models/interviewer-model";

export interface IAdminInterviewerRepository {
  getAllInterviewers(
    page: number,
    limit: number,
    search: string,
  ): Promise<{ interviewers: IInterviewerModel[]; total: number }>;

  getInterviewerData(email: string): Promise<IInterviewerModel | null>;

  updateInterviewerProfile(email: string, data: Partial<IInterviewerModel>): Promise<IInterviewerModel | null>;

  findById(id: string): Promise<IInterviewerModel | null>;
}