import IInterviewerRepository from "@/repositories/interviewer-repository/interfaces/IInterviewerRepository";
import InterviewerRepository from "@/repositories/interviewer-repository/interviewer-repository";
import IInterviewerService from "@/services/interviewers/interfaces/IInterviewerService";
import InterviewerService from "@/services/interviewers/interviewer-service";
import IInterviewerController from "@/controllers/interviewer-controller/interfaces/IInterviewerController";
import { InterviewerController } from "@/controllers/interviewer-controller/interviewer-controller";

import IOtpServices from "@/services/common/interfaces/IOTPService";
import RedisOtpService from "@/services/common/otp-service";
import { IOtpGenerate } from "../../types/types";
import { IJwtService } from "@/services/common/interfaces/IJWTService";
import { JwtService } from "@/services/common/jwt-service";
import { OtpGenerate } from "@/utils/otp-generator";
import { IEmail } from "../../types/email";
import { SendEmail } from "@/utils/send-otp-email";

import { IInterviewerVerificationRepository } from "@/repositories/interviewer-repository/interfaces/IInterviewerVerificationRepository";
import { InterviewerVerificationRepository } from "@/repositories/interviewer-repository/interviewer-verification-repository";
import { IInterviewerVerificationService } from "@/services/interviewers/interfaces/IInterviewerVerificationService";
import { InterviewerVerificationService } from "@/services/interviewers/interviewer-verification-service";
import IInterviewerVerificationController from "@/controllers/interviewer-controller/interfaces/IInterviewerVerificationController";
import { InterviewerVerificationController } from "@/controllers/interviewer-controller/interviewer-verification-controller";

import { IInterviewerProfileRepository } from "@/repositories/interviewer-repository/interfaces/IInterviewerProfileRepository";
import { InterviewerProfileRepository } from "@/repositories/interviewer-repository/interviewer-profile-repository";
import { IInterviewerProfileService } from "@/services/interviewers/interfaces/IInterviewerProfileService";
import { InterviewerProfileService } from "@/services/interviewers/interviewer-profile-service";
import { IInterviewerProfileController } from "@/controllers/interviewer-controller/interfaces/IInterviewerProfileController";
import { InterviewerProfileController } from "@/controllers/interviewer-controller/interviewer-profile-controller";

import { IAdminUserRepository } from "@/repositories/admin-repository/interfaces/IAdminUserRepository";
import { AdminUserRespository } from "@/repositories/admin-repository/admin-user-repository";

import { IAdminInterviewerRepository } from "@/repositories/admin-repository/interfaces/IAdminInterviewerRepository";
import { AdminInterviewerRespository } from "@/repositories/admin-repository/admin-interviewer-repository";

import { IAdminRepository } from "@/repositories/admin-repository/interfaces/IAdminRepository";
import { AdminRespository } from "@/repositories/admin-repository/admin-repository";



const interviewerRepo : IInterviewerRepository = new InterviewerRepository()

const adminUserRepository : IAdminUserRepository = new AdminUserRespository()

const adminInterviewerRepository : IAdminInterviewerRepository = new AdminInterviewerRespository()

const adminRepository : IAdminRepository = new AdminRespository(adminUserRepository,adminInterviewerRepository)


// Shared
const otpService: IOtpServices = new RedisOtpService();
const otpGenerateService: IOtpGenerate = new OtpGenerate();
const jwtService: IJwtService = new JwtService();
const emailService: IEmail = new SendEmail();

const interviewerRepository: IInterviewerRepository = new InterviewerRepository();
const interviewerService: IInterviewerService = new InterviewerService(interviewerRepository);
const interviewerController: IInterviewerController = new InterviewerController(
  interviewerService,
  otpService,
  otpGenerateService,
  jwtService,
  emailService
);

// Verification
const interviewerVerificationRepository : IInterviewerVerificationRepository = new InterviewerVerificationRepository();
const interviewerVerificationService : IInterviewerVerificationService = new InterviewerVerificationService(interviewerVerificationRepository);
const interviewerVerificationController : IInterviewerVerificationController = new InterviewerVerificationController(interviewerVerificationService);

// Profile
const interviewerProfileRepo : IInterviewerProfileRepository = new InterviewerProfileRepository();
const interviewerProfileService : IInterviewerProfileService = new InterviewerProfileService(interviewerProfileRepo);
const interviewerProfileController : IInterviewerProfileController = new InterviewerProfileController(interviewerProfileService);


export {
  interviewerController,
  interviewerVerificationController,
  interviewerProfileController,

};