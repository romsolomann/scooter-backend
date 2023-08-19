import { Request, Response, NextFunction } from "express";

async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.session || !req.session.user) {
    res.status(401).end("Unauthorized!");
    return;
  }
  next();
}

export { requireAuth };
