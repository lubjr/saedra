export const DIFF_VIOLATION = `diff --git a/src/controllers/users.ts b/src/controllers/users.ts
index a1b2c3d..e4f5g6h 100644
--- a/src/controllers/users.ts
+++ b/src/controllers/users.ts
@@ -1,5 +1,8 @@
 import { Request, Response } from "express";
+import { query } from "@repo/db-connector";

 export async function getUser(req: Request, res: Response) {
-  const user = await userService.findById(req.params.id);
+  const result = await query("SELECT * FROM users WHERE id = $1", [req.params.id]);
+  const user = result.rows[0];
   res.json(user);
 }`;
