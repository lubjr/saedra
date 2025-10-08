import { type AwsCredentials, collectResources } from "@repo/aws-connector/aws";
import { generateDiagramFromResources } from "@repo/diagram-service/diagram";
import { projectRoutes } from "@repo/project-service/projects";
import cors from "cors";
import express from "express";

import { getUsers } from "./db/query.js";
import { startWorker } from "./workers/index.js";

startWorker().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start worker:", error);
});

const start = async () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/", (_req, res) => {
    res.send("API is running");
  });

  app.get("/users", async (_req, res) => {
    const result = await getUsers();
    res.json(result);
  });

  app.use("/projects", projectRoutes);

  app.post("/diagram", async (req, res) => {
    const credentials: AwsCredentials = req.body.credentials;

    if (!credentials) {
      return res.status(400).json({ error: "invalid or missing credentials" });
    }

    try {
      const { resources } = await collectResources(credentials);
      const diagram = generateDiagramFromResources(resources);
      res.json({ diagram });
    } catch (error) {
      res.status(500).json({ error });
    }
  });

  app.listen(3002, () => {
    // eslint-disable-next-line no-console
    console.log("Server is running on http://localhost:3002");
  });
};

start();
