import { projectRoutes } from "@repo/project-service/projects";
import cors from "cors";
import express from "express";

import { requestLogger } from "./middleware/logger.js";
import { bedrockRoutes } from "./routes/bedrock.js";

const start = async () => {
  const startTime = Date.now();
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  app.get("/", (_req, res) => {
    res.json({
      status: "healthy",
      service: "Saedra API",
      version: "0.1.0",
      uptime: `${Math.floor((Date.now() - startTime) / 1000)}s`,
      timestamp: new Date().toISOString(),
      environment: {
        node: process.version,
        aws_region: process.env.AWS_REGION ? "configured" : "not configured",
        supabase_url: process.env.SUPABASE_URL
          ? "configured"
          : "not configured",
      },
    });
  });

  app.use("/projects", projectRoutes);
  app.use("/bedrock", bedrockRoutes);

  // eslint-disable-next-line turbo/no-undeclared-env-vars
  const PORT = process.env.PORT || 3002;

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running on port ${PORT}`);
  });
};

start();
