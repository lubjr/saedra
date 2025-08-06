import cors from "cors";
import express from "express";

import { startResultListener } from "./listeners/resultListener.js";
import iacRoutes from "./routes/iac.js";
import resultRoutes from "./routes/result.js";
import { initNats } from "./services/publisher.js";
import { startWorker } from "./workers/iacAnalyzer.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
initNats().catch((error: any) => {
  // eslint-disable-next-line no-console
  console.error("Failed to initialize NATS:", error);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
startWorker().catch((error: any) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start IaC analyzer worker:", error);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
startResultListener().catch((error: any) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start result listener:", error);
});

const start = async () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use(iacRoutes);
  app.use(resultRoutes);

  app.get("/", (_req, res) => {
    res.send("API is running");
  });

  app.listen(3002, () => {
    // eslint-disable-next-line no-console
    console.log("Server is running on http://localhost:3002");
  });
};

start();
