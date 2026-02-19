import { IUser } from "../../models/user-model";
import IUserService from "./interfaces/IUserService";
import { IUserRepository } from "../../repositories/user-repository.ts/interfaces/IUserRepository";
import { Types } from "mongoose";

export class UserServices implements IUserService {
  private _userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this._userRepository = userRepository;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await this._userRepository.findByEmail(email);
  }

  async findById(userId: string | Types.ObjectId): Promise<IUser | null> {
  return await this._userRepository.findById(userId);
}


  async createUser(userData: IUser): Promise<IUser | null> {
    return await this._userRepository.create(userData);
  }

  async resetPassword(email: string, password: string): Promise<IUser | null> {
    return await this._userRepository.resetPassword(email, password);
  }

  async googleLogin(name: string, email: string): Promise<IUser | null> {
    return await this._userRepository.googleLogin(name, email);
  }
}