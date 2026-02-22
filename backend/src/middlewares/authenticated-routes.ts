import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JwtService } from "@/services/common/jwt-service";
import { AuthErrorMsg } from "../utils/constants";
import { StatusCode } from "../utils/enum";
import dotenv from "dotenv";
import { appLogger } from "../utils/logger";
import { UserPayload } from "@/types/types";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

// req.user type comes from src/types/express.d.ts (UserPayload)

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const accessToken = req.cookies["accessToken"];
  const refreshToken = req.cookies["refreshToken"];

  if (!accessToken) {
    appLogger.info("❌ No accessToken found in cookies");
    res
      .status(StatusCode.UNAUTHORIZED)
      .json({ failToken: true, message: AuthErrorMsg.NO_ACCESS_TOKEN });
    return;
  }

  try {
    const accessPayload = jwt.verify(accessToken, JWT_SECRET) as UserPayload;
    req.user = accessPayload;
    next();
    return;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      if (!refreshToken) {
        res
          .status(StatusCode.UNAUTHORIZED)
          .json({ failToken: true, message: AuthErrorMsg.NO_REFRESH_TOKEN });
        return;
      }

      try {
        const refreshPayload = jwt.verify(refreshToken, JWT_SECRET) as UserPayload;

        if (!refreshPayload) {
          res
            .status(StatusCode.UNAUTHORIZED)
            .json({ message: AuthErrorMsg.INVALID_REFRESH_TOKEN });
          return;
        }

        const currentTime = Math.floor(Date.now() / 1000);
        if (refreshPayload.exp && refreshPayload.exp < currentTime) {
          res
            .status(StatusCode.UNAUTHORIZED)
            .json({ message: AuthErrorMsg.REFRESH_TOKEN_EXPIRED });
          return;
        }

        const jwtService = new JwtService();
        const newAccessToken = await jwtService.accessToken({
          id: refreshPayload.id,
          email: refreshPayload.email,
          role: refreshPayload.role,
        });

        appLogger.info("new Access Token", newAccessToken);

        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
        });

        req.cookies["accessToken"] = newAccessToken;
        req.user = refreshPayload;
        next();
        return;
      } catch (refreshErr) {
        if (refreshErr instanceof jwt.TokenExpiredError) {
          res
            .status(StatusCode.UNAUTHORIZED)
            .json({ message: AuthErrorMsg.REFRESH_TOKEN_EXPIRED });
          return;
        }

        res
          .status(StatusCode.UNAUTHORIZED)
          .json({ message: AuthErrorMsg.INVALID_ACCESS_TOKEN });
        return;
      }
    }

    res
      .status(StatusCode.BAD_REQUEST)
      .json({ message: AuthErrorMsg.INVALID_ACCESS_TOKEN });
    return;
  }
};

export default authenticateToken;