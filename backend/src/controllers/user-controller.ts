import { Request, Response } from 'express';
import  IUserController  from './interfaces/IUserController';
import  IUserServices  from '../services/interfaces/IUserServices';
import  IOtpServices from '../services/interfaces/IOtpService';
import  {statusCode}  from '../utils/constants/messages/status.code';

export class UserController implements IUserController {
  private userServices: IUserServices;
  private otpServices: IOtpServices;

  constructor(userServices: IUserServices, otpServices: IOtpServices) {
    this.userServices = userServices;
    this.otpServices = otpServices;
  }

  public async placeholder(req: Request, res: Response): Promise<any> {
    return res.status(statusCode.ok).json({
      success: true,
      message: 'UserController placeholder - not implemented yet',
    });
  }
}