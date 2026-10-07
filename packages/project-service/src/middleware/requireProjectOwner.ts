import { Request, Response, NextFunction } from "express";
import { ProjectDB } from "@repo/db-queries/queries";

export async function requireProjectOwner(req: Request, res: Response, next: NextFunction) {
  const { projectId } = req.params;

  if (!projectId) {
    return res.status(400).json({ error: "projectId required" });
  }

  try {
    const { data, error } = await ProjectDB.getProjectOwner(projectId);

    if (error || !data || data.user_id !== req.user?.id) {
      return res.status(404).json({ error: "project not found" });
    }

    next();
  } catch {
    return res.status(404).json({ error: "project not found" });
  }
}
