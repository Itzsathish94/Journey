import {
    VerificationRequestDTO,
    VerificationRequestDetailDTO,
  } from "../../../dto/admin-dto/verification-request-dto";
  
  export interface IAdminVerificationService {
    getAllRequests(
      page: number,
      limit: number,
      search?: string,
    ): Promise<{ data: VerificationRequestDTO[]; total: number }>;
  
    getRequestDataByEmail(
      email: string,
    ): Promise<VerificationRequestDetailDTO | null>;
  
    approveRequest(
      email: string,
      status: string,
      reason?: string,
    ): Promise<VerificationRequestDTO | null>;
  }