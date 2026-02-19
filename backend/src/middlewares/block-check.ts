import { Response, NextFunction } from "express";
import { StatusCode, Roles } from "../utils/enum";
import { AuthErrorMsg } from "../utils/constants/constants";
import { UserRepository } from "../repositories/user-repository.ts/user-repository";
import InterviewerRepository from "../repositories/interviewer-repository/interviewer-repository";
import { AuthenticatedRequest } from "./authenticated-routes";
import { appLogger } from "../utils/logger";

export const restrictBlockedUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user || !req.user.id || !req.user.role) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res
        .status(StatusCode.UNAUTHORIZED)
        .json({ message: AuthErrorMsg.INVALID_ACCESS_TOKEN });
      return;
    }

    let user;
    if (req.user.role === Roles.USER) {
      const userRepo = new UserRepository();
      user = await userRepo.findById(req.user.id);
    } else if (req.user.role === Roles.INTERVIEWER) {
      const interviewerRepo = new InterviewerRepository();
      user = await interviewerRepo.findById(req.user.id);
    } else if (req.user.role === Roles.ADMIN) {
      return next();
    } else {
      res
        .status(StatusCode.UNAUTHORIZED)
        .json({ message: AuthErrorMsg.INVALID_ROLE });
      return;
    }

    if (!user) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res
        .status(StatusCode.UNAUTHORIZED)
        .json({ message: AuthErrorMsg.USER_NOT_FOUND });
      return;
    }

    if (user.isBlocked) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res
        .status(StatusCode.FORBIDDEN)
        .json({ message: AuthErrorMsg.ACCOUNT_BLOCKED });
      return;
    }
    next();
  } catch (error) {
    appLogger.error("Restrict Blocked User Error:", error);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      message: AuthErrorMsg.INTERNAL_SERVER_ERROR,
      error: error instanceof Error && error.message,
    });
  }
};