import { SendEmail } from "../../utils/send-otp-email";
import { IEmail } from "../../types/email";
const emailService: IEmail = new SendEmail();

import { IAdminRepository } from "../../repositories/admin-repository/interfaces/IAdminRepository";
import { AdminRespository } from "@/repositories/admin-repository/admin-repository";
import { IAdminService } from "@/services/admin/interfaces/IAdminService";
import { AdminService } from "@/services/admin/admin-service";
import { IAdminController } from "@/controllers/admin/interfaces/IAdminController";
import { AdminController } from "@/controllers/admin/admin-controller";

import { IAdminUserRepository } from "@/repositories/admin-repository/interfaces/IAdminUserRepository";
import { AdminUserRespository } from "@/repositories/admin-repository/admin-user-repository";
import { IAdminInterviewerRepository } from "@/repositories/admin-repository/interfaces/IAdminInterviewerRepository";
import { AdminInterviewerRespository } from "@/repositories/admin-repository/admin-interviewer-repository";

import { IAdminVerificationRepository } from "@/repositories/admin-repository/interfaces/IAdminVerification";
import { AdminVerificationRepository } from "@/repositories/admin-repository/admin-verification-repository";
import { IAdminVerificationService } from "@/services/admin/interfaces/IAdminVerificationService";
import { AdminVerificationService } from "@/services/admin/admin-verification-service";
import IAdminVerificationController from "@/controllers/admin/interfaces/IAdminVerificationController"
import { AdminVerificationController } from "@/controllers/admin/admin-verification-controller";

import { IAdminDomainRepository } from "@/repositories/admin-repository/interfaces/IAdminDomainRepository";
import { AdminDomainRepository } from "@/repositories/admin-repository/admin-domain-repository";
import { IAdminDomainService } from "@/services/admin/interfaces/IAdminDomainService";
import { AdminDomainService } from "@/services/admin/admin-domain-service";
import { IAdminDomainController } from "@/controllers/admin/interfaces/IAdminDomainController";
import { AdminDomainController } from "@/controllers/admin/admin-domain-controller";

import { IAdminSkillRepository } from "@/repositories/admin-repository/interfaces/IAdminSkillRepository";
import { AdminSkillRepository } from "@/repositories/admin-repository/admin-skill-repository";
import { IAdminSkillService } from "@/services/admin/interfaces/IAdminSkillService";
import { AdminSkillService } from "@/services/admin/admin-skill-service";
import { IAdminSkillController } from "@/controllers/admin/interfaces/IAdminSkillController";
import { AdminSkillController } from "@/controllers/admin/admin-skill-controller";

import { IJwtService } from "@/services/common/interfaces/IJWTService";
import { JwtService } from "@/services/common/jwt-service";
import { IHashService } from "@/services/common/interfaces/IHashService";
import { HashService } from "@/services/common/hash-service";

import IInterviewerRepository from "@/repositories/interviewer-repository/interfaces/IInterviewerRepository";
import InterviewerRepository from "@/repositories/interviewer-repository/interviewer-repository";
import IInterviewerService from "@/services/interviewers/interfaces/IInterviewerService";
import InterviewerService from "@/services/interviewers/interviewer-service";


const adminUserRepository: IAdminUserRepository = new AdminUserRespository();
const adminInterviewerRepository: IAdminInterviewerRepository = new AdminInterviewerRespository();
const adminRespository: IAdminRepository = new AdminRespository(
  adminUserRepository,
  adminInterviewerRepository
);

const interviewerRepo : IInterviewerRepository = new InterviewerRepository()
const interviewerService:IInterviewerService =new InterviewerService(interviewerRepo)

const jwtService: IJwtService = new JwtService();
const hashService: IHashService = new HashService();

const adminService: IAdminService = new AdminService(adminRespository);
const adminController: IAdminController = new AdminController(adminService, jwtService, hashService);

// Verification
const adminVerificationRepository:IAdminVerificationRepository = new AdminVerificationRepository();
const adminVerificationService:IAdminVerificationService = new AdminVerificationService(adminVerificationRepository,interviewerService);
const adminVerificationController:IAdminVerificationController = new AdminVerificationController(adminVerificationService,emailService);

// Domain
const adminDomainRepository : IAdminDomainRepository = new AdminDomainRepository();
const adminDomainServie : IAdminDomainService= new AdminDomainService(adminDomainRepository);
const adminDomainController : IAdminDomainController = new AdminDomainController(adminDomainServie);

//skill
const adminSkillRepository : IAdminSkillRepository = new AdminSkillRepository();
const adminSkillServie : IAdminSkillService= new AdminSkillService(adminSkillRepository);
const adminSkillController : IAdminSkillController = new AdminSkillController(adminSkillServie);

export {
  adminController,
  adminVerificationController,
  adminDomainController,
  adminSkillController
};