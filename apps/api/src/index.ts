import express from 'express';
import cors from 'cors';

import { initNats } from './services/publisher.js';
import { startWorker } from './workers/iacAnalyzer.js';
import { startResultListener } from './listeners/resultListener.js';

import iacRoutes from './routes/iac.js';
import resultRoutes from './routes/result.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
initNats().catch((err: any) => {
  console.error('Failed to initialize NATS:', err);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
startWorker().catch((err: any) => {
  console.error('Failed to start IaC analyzer worker:', err);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
startResultListener().catch((err: any) => {
  console.error('Failed to start result listener:', err);
});

async function start() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use(iacRoutes);
  app.use(resultRoutes);

  app.get('/', (_req, res) => {
    res.send('API is running');
  });

  app.listen(3002, () => {
    console.log('Server is running on http://localhost:3002');
  });
}

start();