import { Request, Response, NextFunction } from "express";
import { LoginDB, ApiTokenDB, hashToken } from "@repo/db-queries/queries";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const API_TOKEN_PREFIX = "saedra_pat_";

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "missing authorization header" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "missing token" });

    if (token.startsWith(API_TOKEN_PREFIX)) {
      const userId = await ApiTokenDB.getUserIdByTokenHash(hashToken(token));
      if (!userId) return res.status(401).json({ error: "invalid or revoked token" });

      req.user = { id: userId, authType: "api_token" };
      return next();
    }

    const { data, error } = await LoginDB.validateToken(token);
    if (error || !data.user) {
      return res.status(401).json({ error: error?.message || "invalid token" });
    }

    req.user = { ...data.user, authType: "session" };
    next();
  } catch (err: any) {
    return res.status(401).json({ error: err.message || "unauthorized" });
  }
}