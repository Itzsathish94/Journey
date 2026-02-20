import { IMockOffering } from "../../../models/interviewer-model";

export interface IInterviewerMockService {
  getMyOfferings(interviewerId: string): Promise<IMockOffering[]>;

  createOffering(
    interviewerId: string,
    payload: {
      domainId: string;
      skillIds: string[];
      industryIds: string[];
      difficultyLevels: {
        level: "entry" | "mid" | "senior" | "job_desc_only";
        duration?: number;
        price: number;
      }[];
    },
  ): Promise<IMockOffering[]>;

  updateOffering(
    interviewerId: string,
    mockId: string,
    update: Partial<IMockOffering>,
  ): Promise<IMockOffering[]>;

  toggleOffering(
    interviewerId: string,
    mockId: string,
    isActive: boolean,
  ): Promise<IMockOffering[]>;
}

