import { Request, Response, NextFunction } from "express";
import { UserPayload } from "@/types/types";
import { StatusCode, Roles } from "../utils/enum";
import { AuthErrorMsg } from "../utils/constants";
import { UserRepository } from "../repositories/user-repository.ts/user-repository";
import InterviewerRepository from "../repositories/interviewer-repository/interviewer-repository";
import { appLogger } from "../utils/logger";

export const restrictBlockedUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const payload = req.user as UserPayload | undefined;
    if (!payload || !payload.id || !payload.role) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res
        .status(StatusCode.UNAUTHORIZED)
        .json({ message: AuthErrorMsg.INVALID_ACCESS_TOKEN });
      return;
    }

    let user;
    if (payload.role === Roles.USER) {
      const userRepo = new UserRepository();
      user = await userRepo.findById(payload.id);
    } else if (payload.role === Roles.INTERVIEWER) {
      const interviewerRepo = new InterviewerRepository();
      user = await interviewerRepo.findById(payload.id);
    } else if (payload.role === Roles.ADMIN) {
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