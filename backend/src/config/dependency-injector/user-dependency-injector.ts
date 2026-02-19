import IOtpServices from "@/services/common/interfaces/IOTPService";
import RedisOtpService from "@/services/common/otp-service";
import { IOtpGenerate } from "../../types/types";
import { IJwtService } from "@/services/common/interfaces/IJWTService";
import { JwtService } from "@/services/common/jwt-service";
import { OtpGenerate } from "@/utils/otp-generator";
import { IEmail } from "../../types/email";
import { SendEmail } from "@/utils/send-otp-email";

import { IUserRepository } from "@/repositories/user-repository.ts/interfaces/IUserRepository";
import { UserRepository } from "@/repositories/user-repository.ts/user-repository";
import { UserProfileRepository } from "@/repositories/user-repository.ts/user-profile-repository";
import { IUserProfileRepository } from "@/repositories/user-repository.ts/interfaces/IUserProfileRepository";

import { IUserInterviewerListingRepository } from "@/repositories/user-repository.ts/interfaces/IUserInterviewerListingRepository";
import { UserInterviewerListingRepository } from "@/repositories/user-repository.ts/user-interviewer-listing-respository";

// import { IAdminRepository } from "@/repositories/admin-repository/interfaces/IAdminRepository";
// import { AdminRespository } from "@/repositories/admin-repository/admin-repository";
// import IInterviewerRepository from "@/repositories/interviewer-repository/interfaces/IInterviewerRepository";
// import InterviewerRepository from "@/repositories/interviewer-repository/interviewer-repository";
// import { IAdminInterviewerRepository } from "@/repositories/admin-repository/interfaces/IAdminInterviewerRepository";
// import { AdminInterviewerRespository } from "@/repositories/admin-repository/admin-interviewer-repository";


// Services
import IUserService from "@/services/user/interfaces/IUserService";
import { UserServices } from "@/services/user/user-service";
import { IUserProfileService } from "@/services/user/interfaces/IUserProfileService";
import { UserProfileService } from "@/services/user/user-profile-service";
import { IUserInterviewerListingService } from "@/services/user/interfaces/IUserInterviewerListingService";
import { UserInterviewerListingService } from "@/services/user/user-interviewer-listing-service";


// Controllers
import IUserController from "@/controllers/user-controller/interfaces/IUserController";
import { UserController } from "@/controllers/user-controller/user-controller";
import { IUserProfileController } from "@/controllers/user-controller/interfaces/IUserProfileController";
import { UserProfileController } from "@/controllers/user-controller/user-profile-controller";
import {IUserInterviewerListingController} from "../../controllers/user-controller/interfaces/IUserInterviewerListingController"
import { UserInterviewerListingController } from "@/controllers/user-controller/user-interviewer-listing-controller";


const jwtService: IJwtService = new JwtService();
const emailService: IEmail = new SendEmail();
const otpGenerateService: IOtpGenerate = new OtpGenerate();
const otpService: IOtpServices = new RedisOtpService();

const userRepository: IUserRepository = new UserRepository();
const userService: IUserService = new UserServices(userRepository);
const userController: IUserController = new UserController(
  userService,
  otpService,
  otpGenerateService,
  jwtService,
  emailService
);

//  User Profile

const userProfileRepo: IUserProfileRepository = new UserProfileRepository();
const userProfileService: IUserProfileService = new UserProfileService(userProfileRepo);
const userProfileController: IUserProfileController = new UserProfileController(userProfileService);


// Interviewer Listing

const userInterviewerListingRepository : IUserInterviewerListingRepository = new UserInterviewerListingRepository();
const userInterviewerListingService : IUserInterviewerListingService = new UserInterviewerListingService(userInterviewerListingRepository);
const userInterviewerListingController : IUserInterviewerListingController = new UserInterviewerListingController(userInterviewerListingService);




export {
  userController,
  userProfileController,
  userInterviewerListingController,
};