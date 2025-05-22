import { UserError } from "../utils/constants/messages/messages";
import UserModel, { IUserDTO } from "../models/user-model";
import { IUser } from "../models/user-model";
import { GenericRepository } from "./generic-repository";
import { IUserRepository } from "./interfaces/IAuthRepository";

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
      const student = await this.findOne({ email });
      if (!student) {
        throw new Error(UserError.USER_NOT_FOUND);
      }
      const studentId = student._id as unknown as string;

      const response = await this.update(studentId, { password });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async googleLogin(
    name: string,
    email: string,
    password: string
  ): Promise<IUser | null> {
    const user = await this.findByEmail(email);
    const username = name;

    if (!user) {
      const newUser = await this.createUser({ name, email, password });
      return newUser;
    }

    return user;
  }

  async updateProfile(email: string, data: IUser): Promise<IUser | null> {
    try {
      const student = await this.findOne({ email });
      if (!student) {
        throw new Error("No Student data found");
      }
      const studentId = student._id as unknown as string;

      const response = await this.update(studentId, data);
      return response;
    } catch (error) {
      throw error;
    }
  }
}