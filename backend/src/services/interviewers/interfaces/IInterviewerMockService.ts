import { DifficultyLevel, IMockOffering } from "../../../models/interviewer-model";

export type CreateMockOfferingPayload = {
  domainId: string;
  skillIds: string[];
  industryIds: string[];
  difficultyLevels: {
    level: DifficultyLevel;
    price: number;
  }[];
};

export type UpdateMockOfferingPayload = {
  difficultyLevels: {
    level: DifficultyLevel;
    price: number;
  }[];
};

export interface IInterviewerMockService {
  getMyOfferings(interviewerId: string): Promise<IMockOffering[]>;

  createOffering(interviewerId: string, payload: CreateMockOfferingPayload): Promise<IMockOffering>;

  updateOffering(
    interviewerId: string,
    mockId: string,
    update: UpdateMockOfferingPayload,
  ): Promise<IMockOffering>;

  toggleOffering(interviewerId: string, mockId: string, isActive: boolean): Promise<IMockOffering>;
}