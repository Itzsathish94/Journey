import { Request, Response, NextFunction, RequestHandler } from "express";
import { UserPayload } from "@/types/types";
import { Roles, StatusCode } from "../utils/enum";
import { AuthErrorMsg } from "../utils/constants";

// authenticateToken MUST run before these
const requireAuthUser = (req: Request, res: Response): boolean => {
  if (!req.user) {
    res.status(StatusCode.UNAUTHORIZED).send(AuthErrorMsg.ACCESS_FORBIDDEN);
    return false;
  }
  return true;
};

export const isUser: RequestHandler = (req, res, next) => {
  if (!requireAuthUser(req, res)) return;
  if ((req.user as UserPayload).role !== Roles.USER) {
    res.status(StatusCode.FORBIDDEN).send(AuthErrorMsg.ACCESS_FORBIDDEN);
    return;
  }
  next();
};

export const isInterviewer: RequestHandler = (req, res, next) => {
  if (!requireAuthUser(req, res)) return;
  if ((req.user as UserPayload).role !== Roles.INTERVIEWER) {
    res.status(StatusCode.FORBIDDEN).send(AuthErrorMsg.ACCESS_FORBIDDEN);
    return;
  }
  next();
};

export const isAdmin: RequestHandler = (req, res, next) => {
  if (!requireAuthUser(req, res)) return;
  if ((req.user as UserPayload).role !== Roles.ADMIN) {
    res.status(StatusCode.FORBIDDEN).send(AuthErrorMsg.ACCESS_FORBIDDEN);
    return;
  }
  next();
};