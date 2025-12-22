import { projectRoutes } from "@repo/project-service/projects";
import cors from "cors";
import express from "express";

import { requestLogger } from "./middleware/logger.js";
import { bedrockRoutes } from "./routes/bedrock.js";

const start = async () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  app.get("/", (_req, res) => {
    res.send("API is running");
  });

  app.use("/projects", projectRoutes);
  app.use("/bedrock", bedrockRoutes);

  app.listen(3002, () => {
    // eslint-disable-next-line no-console
    console.log("Server is running on http://localhost:3002");
  });
};

start();
