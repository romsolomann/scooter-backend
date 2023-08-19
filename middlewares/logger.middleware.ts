import { UserResponse } from "./../interfaces/user.interface";
import { Request, Response, NextFunction } from "express";
import { logger } from "../services/logger.service";

declare module "express-session" {
  interface SessionData {
    connectedAt?: number;
    user: UserResponse;
  }
}

async function log(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (req.session && req.session.user) {
    logger.info("Req from: " + req.session.user.username);
  }
  next();
}

export { log };
