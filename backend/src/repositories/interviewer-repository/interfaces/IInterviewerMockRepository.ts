import { IInterviewerModel, IMockOffering } from "../../../models/interviewer-model";

export interface IInterviewerMockRepository {
  addMockOffering(
    interviewerId: string,
    offering: Omit<IMockOffering, "_id">,
  ): Promise<IInterviewerModel | null>;

  updateMockOffering(
    interviewerId: string,
    mockId: string,
    update: Partial<IMockOffering>,
  ): Promise<IInterviewerModel | null>;

  toggleMockActive(
    interviewerId: string,
    mockId: string,
    isActive: boolean,
  ): Promise<IInterviewerModel | null>;

  getMockOfferings(interviewerId: string): Promise<IMockOffering[]>;
}

