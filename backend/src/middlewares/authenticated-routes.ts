import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../utils/jwt';
import { Roles } from '../utils/enum';
import { JwtError } from '../utils/constants/messages/messages';
import { UserPayload } from '../types/types'; 

const jwtService = new JwtService();

export const authenticate = async (
  req: Request & { user?: UserPayload },  
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const accessToken = req.cookies['accessToken'];
    const refreshToken = req.cookies['refreshToken'];

    if (!accessToken) {
      console.log('[Middleware] No access token provided');
      res.status(401).json({ success: false, message: 'No access token provided' });
      return;
    }

    let payload = await jwtService.verifyToken(accessToken);
    if (payload) {
      req.user = {
        _id: payload._id,
        email: payload.email,
        role: payload.role as Roles,
        isVerified: payload.isVerified,
      };
      return next();
    }

    if (!refreshToken) {
      console.log('[Middleware] No refresh token provided');
      res.status(401).json({ success: false, message: 'No refresh token provided' });
      return;
    }

    const refreshPayload = await jwtService.verifyToken(refreshToken);
    
    if (!refreshPayload) {
      console.log('[Middleware] Invalid refresh token');
      res.status(401).json({ success: false, message: 'Invalid refresh token' });
      return;
    }

    if (!Object.values(Roles).includes(refreshPayload.role as Roles)) {
      console.log(`[Middleware] Invalid role: ${refreshPayload.role}`);
      res.status(403).json({ success: false, message: 'Invalid role' });
      return;
    }

    const newAccessToken = await jwtService.accessToken({
      _id: refreshPayload._id,
      email: refreshPayload.email,
      role: refreshPayload.role as Roles,
      isVerified: refreshPayload.isVerified,
    });

    console.log(`[Middleware] New access token generated for user: ${refreshPayload.email}`);

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    req.user = refreshPayload;
    return next();
  } catch (error: any) {
    console.error(`[Middleware] Authentication error: ${error.message}`);
    res.status(401).json({ success: false, message: JwtError.INVALID_JWT });
    return;
  }
};
