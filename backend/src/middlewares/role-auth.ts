import { Request, Response, NextFunction } from 'express';
import { Roles } from '../utils/enum';
import { statusCode } from '../utils/constants/messages/status.code';
import { AuthError } from '../utils/constants/messages/messages';
import { UserPayload } from '../types/types';
import { IUser } from '../models/user-model';

interface AuthenticatedRequest extends Request {
  user?: UserPayload | IUser;
}

export const isUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user as UserPayload;
    if (!user) {
      console.log('[RoleAuth] No user found in request');
      res.status(statusCode.unauthorized).json({ message: AuthError.ACCESS_FORBIDDEN });
      return;
    }

    if (user.role !== Roles.USER) {
      console.log(`[RoleAuth] Access denied for role: ${user.role}, expected: ${Roles.USER}`);
      res.status(statusCode.unauthorized).json({ message: AuthError.ACCESS_FORBIDDEN });
      return;
    }

    console.log(`[RoleAuth] User role verified for email: ${user.email}`);
    return next();
  } catch (error: any) {
    console.error(`[RoleAuth] Role verification error: ${error.message}`);
    res.status(statusCode.internalServer).json({ message: 'Internal Server Error' });
    return;
  }
};

export const isAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user as UserPayload;
    if (!user) {
      console.log('[RoleAuth] No user found in request');
      res.status(statusCode.unauthorized).json({ message: AuthError.ACCESS_FORBIDDEN });
      return;
    }

    if (user.role !== Roles.ADMIN) {
      console.log(`[RoleAuth] Access denied for role: ${user.role}, expected: ${Roles.ADMIN}`);
      res.status(statusCode.unauthorized).json({ message: AuthError.ACCESS_FORBIDDEN });
      return;
    }

    console.log(`[RoleAuth] Admin role verified for email: ${user.email}`);
    return next();
  } catch (error: any) {
    console.error(`[RoleAuth] Role verification error: ${error.message}`);
    res.status(statusCode.internalServer).json({ message: 'Internal Server Error' });
    return;
  }
};