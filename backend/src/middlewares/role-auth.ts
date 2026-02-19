import { JwtPayload } from "jsonwebtoken";
import { Roles, StatusCode } from "../utils/enum";
import { JwtService } from "@/services/common/jwt-service";
import { Request, Response, NextFunction } from "express";
import { AuthErrorMsg } from "../utils/constants/constants";
import { appLogger } from "../utils/logger";

const isValidPayload = (decoded: string | JwtPayload): decoded is JwtPayload =>
  typeof decoded === "object" && decoded !== null;

export const isUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      res.status(StatusCode.UNAUTHORIZED).send(AuthErrorMsg.ACCESS_FORBIDDEN);
      return;
    }

    const jwtService = new JwtService();
    const decoded = await jwtService.verifyToken(token);

    if (!isValidPayload(decoded) || decoded.role !== Roles.USER) {
      res.status(StatusCode.UNAUTHORIZED).send(AuthErrorMsg.ACCESS_FORBIDDEN);
      return;
    }
    next();
  } catch (error) {
    appLogger.error("error in role Auth", error);
    res.status(StatusCode.UNAUTHORIZED).send(AuthErrorMsg.INVALID_ACCESS_TOKEN);
  }
};


export const isInterviewer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      res.status(StatusCode.UNAUTHORIZED).send(AuthErrorMsg.ACCESS_FORBIDDEN);
      return;
    }

    const jwtService = new JwtService();
    const decoded = await jwtService.verifyToken(token);

    if (!isValidPayload(decoded) || decoded.role !== Roles.INTERVIEWER) {
      res.status(StatusCode.UNAUTHORIZED).send(AuthErrorMsg.ACCESS_FORBIDDEN);
      return;
    }
    next();
  } catch (error) {
    appLogger.error("error in interviewer role Auth", error);
    res.status(StatusCode.UNAUTHORIZED).send(AuthErrorMsg.INVALID_ACCESS_TOKEN);
  }
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      res.status(StatusCode.UNAUTHORIZED).send(AuthErrorMsg.ACCESS_FORBIDDEN);
      return;
    }

    const jwtService = new JwtService();
    const decoded = await jwtService.verifyToken(token);

    if (!isValidPayload(decoded) || decoded.role !== Roles.ADMIN) {
      res.status(StatusCode.UNAUTHORIZED).send(AuthErrorMsg.ACCESS_FORBIDDEN);
      return;
    }
    next();
  } catch (error) {
    appLogger.error("error in admin role Auth", error);
    res.status(StatusCode.UNAUTHORIZED).send(AuthErrorMsg.INVALID_ACCESS_TOKEN);
  }
};