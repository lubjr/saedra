import { Router } from "express";
import { collectResources } from "./collectors.js";
import { AwsCredentials } from "./types.js";

const router: Router = Router();

router.post("/discover", async (req, res) => {
  try {
    const credentials = req.body as AwsCredentials;
    const result = await collectResources(credentials);
    res.json(result);
  } catch (err: any) {
    console.error("[aws-connector] error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;