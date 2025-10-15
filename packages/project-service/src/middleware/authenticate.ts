import { Request, Response, NextFunction } from "express";
import { LoginDB } from "@repo/db-queries/queries";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "missing authorization header" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "missing token" });

    const user = await LoginDB.validateToken(token);
    req.user = user;
    next();
  } catch (err: any) {
    return res.status(401).json({ error: err.message || "unauthorized" });
  }
}