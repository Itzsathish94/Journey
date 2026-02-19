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

import { IAdminCategoryRepository } from "@/repositories/admin-repository/interfaces/IAdminCategoryRepository";
import { AdminCategoryRepository } from "@/repositories/admin-repository/admin-category-repository";
import { IAdminCategoryService } from "@/services/admin/interfaces/IAdminCategoryService";
import { AdminCategoryService } from "@/services/admin/admin-category-service";
import { IAdminCategoryController } from "@/controllers/admin/interfaces/IAdminCategoryController";
import { AdminCategoryController } from "@/controllers/admin/admin-category-controller";

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

// Category
const adminCategoryRepository : IAdminCategoryRepository = new AdminCategoryRepository();
const adminCategoryServie : IAdminCategoryService= new AdminCategoryService(adminCategoryRepository);
const adminCategoryController : IAdminCategoryController = new AdminCategoryController(adminCategoryServie);

export {
  adminController,
  adminVerificationController,
  adminCategoryController
};