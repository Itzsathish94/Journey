import { IUserRepository } from '../repositories/interfaces/IAuthRepository';
import { UserRepository } from '../repositories/auth-repository';
import  IOtpRepository  from '../repositories/interfaces/IOtpRepository';
import { OtpRespository } from '../repositories/otp-repository';
import IRefreshTokenRepository from '../repositories/interfaces/IRefreshTokenRepository';
import { RefreshTokenRepository } from '../repositories/refresh-token-repository';
import IUserServices from '../services/interfaces/IUserServices';
import { UserService } from '../services/user-service';
import IOtpServices from '../services/interfaces/IOtpService';
import { OtpService } from '../services/otp-service';
import IRefreshTokenServices from '../services/interfaces/IRefreshTokenService';
import { RefreshTokenService } from '../services/refresh-token-service';
import IAuthServices from '../services/interfaces/IAuthService';
import { AuthServices } from '../services/auth-service';
import IUserController from '../controllers/interfaces/IUserController';
import { UserController } from '../controllers/user-controller';
import IAuthController from '../controllers/interfaces/IAuthController';
import { AuthController } from '../controllers/auth-controller';

// Instantiate repositories
const userRepository: IUserRepository = new UserRepository();
const otpRepository: IOtpRepository = new OtpRespository();
const refreshTokenRepository: IRefreshTokenRepository = new RefreshTokenRepository();

// Instantiate services
const userService: IUserServices = new UserService(userRepository);
const otpService: IOtpServices = new OtpService(otpRepository);
const refreshTokenService: IRefreshTokenServices = new RefreshTokenService(refreshTokenRepository);
const authServices: IAuthServices = new AuthServices(userService, otpService, refreshTokenService);

// Instantiate controllers
const userController: IUserController = new UserController(userService, otpService);
const authController: IAuthController = new AuthController(authServices);

export { userController, authController, refreshTokenService };