import { IUser, IUserDTO } from '../models/user-model';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { Roles } from '../utils/enum';
import IUserServices from './interfaces/IUserServices';

export class UserService implements IUserServices {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async createUser(userDTO: IUserDTO, role: Roles): Promise<IUser> {
    return await this.userRepository.create({
      ...userDTO,
      role,
      isBlocked: false,
      isSubscribed: false,
      isVerified: true,
      profilePicUrl: 'https://freesvg.org/img/abstract-user-flat-4.png',
    });
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await this.userRepository.findOne({ email });
  }
}