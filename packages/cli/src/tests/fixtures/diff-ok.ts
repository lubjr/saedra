export const DIFF_OK = `diff --git a/src/controllers/teams.ts b/src/controllers/teams.ts
index b2c3d4e..f5g6h7i 100644
--- a/src/controllers/teams.ts
+++ b/src/controllers/teams.ts
@@ -1,5 +1,8 @@
 import { Request, Response } from "express";
+import { findTeamById } from "@repo/db-queries";

 export async function getTeam(req: Request, res: Response) {
-  const team = await teamService.findById(req.params.id);
+  const team = await findTeamById(req.params.id);
   res.json(team);
 }`;
