import { IInterviewerVerificationService } from "./interfaces/IInterviewerVerificationService";
import { IVerificationModel } from "../../models/verification-model";
import { IInterviewerVerificationRepository } from "../../repositories/interviewer-repository/interfaces/IInterviewerVerificationRepository";
import { VerificationErrorMessages } from "../../utils/constants/constants";

export class InterviewerVerificationService
  implements IInterviewerVerificationService
{
  private _verificationRepository: IInterviewerVerificationRepository;

  constructor(verificationRepository: IInterviewerVerificationRepository) {
    this._verificationRepository = verificationRepository;
  }

  async sendVerifyRequest(
    username: string,
    email: string,
    degreeCertificateUrl: string,
    resumeUrl: string,
    status: string,
  ): Promise<IVerificationModel> {
    const result = await this._verificationRepository.sendVerifyRequest(
      username,
      email,
      degreeCertificateUrl,
      resumeUrl,
      status,
    );
    if (!result) {
      throw new Error(VerificationErrorMessages.VERIFICATION_REQUEST_FAILED);
    }
    return result;
  }

  async getRequestByEmail(email: string): Promise<IVerificationModel | null> {
    return await this._verificationRepository.getRequestByEmail(email);
  }

  async reverifyRequest(
    username: string,
    email: string,
    degreeCertificateUrl: string,
    resumeUrl: string,
  ): Promise<IVerificationModel> {
    const updated = await this._verificationRepository.updateRequestByEmail(
      email,
      {
        username,
        degreeCertificateUrl,
        resumeUrl,
        status: "pending",
        rejectionReason: undefined,
        reviewedAt: null,
      },
    );

    if (!updated) {
      throw new Error("Failed to update verification request");
    }

    return updated;
  }
}