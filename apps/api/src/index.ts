import { projectRoutes } from "@repo/project-service/projects";
import cors from "cors";
import express from "express";
import { bedrockRoutes } from "./routes/bedrock.js";

/* Disable worker for now */
// import { startWorker } from "./workers/index.js";

// startWorker().catch((error) => {
//   // eslint-disable-next-line no-console
//   console.error("Failed to start worker:", error);
// });

const start = async () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

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
