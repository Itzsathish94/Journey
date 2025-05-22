import { IUser, IUserDTO } from '../../models/user-model';
import { Roles } from '../../utils/enum';

export default interface IUserServices {
  createUser(userDTO: IUserDTO, role: Roles): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
}