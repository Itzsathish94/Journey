import { UserErrorMessages } from "../../utils/constants";
import UserModel, { IUser, IUserDTO } from "../../models/user-model";
import { GenericRepository } from "../generic-repository";
import { IUserRepository } from "../user-repository.ts/interfaces/IUserRepository";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";
export class UserRepository
  extends GenericRepository<IUser>
  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await this.findOne({ email });
  }

  async createUser(userData: IUserDTO): Promise<IUser | null> {
    return await this.create(userData);
  }

  async resetPassword(email: string, password: string): Promise<IUser | null> {
    try {
      const user = await this.findOne({ email });

      if (!user) {
        throw new Error(UserErrorMessages.USER_NOT_FOUND);
      }

      const userId = user._id as unknown as string;

      const response = await this.update(userId, { password });

      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(userId: string, data: Partial<IUser>): Promise<IUser | null> {
    try {
      return await this.update(userId, data);
    } catch (error) {
      throw error;
    }
  }

  async googleLogin(name: string, email: string): Promise<IUser | null> {
    const user = await this.findByEmail(email);
    const username = name;

    if (!user) {
      const tempPassword =
        Date.now().toString() + Math.floor(Math.random() * 10000).toString();
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      const newUser = await this.createUser({
        username,
        email,
        password: hashedPassword,
        role: "user",
      });

      return newUser;
    }

    return user;
  }

  async findById(userId: string | Types.ObjectId): Promise<IUser | null> {
    return await super.findById(userId.toString());
  }
}