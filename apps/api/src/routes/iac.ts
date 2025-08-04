import { Router } from 'express';
import { publishIacForAnalysis } from '../services/publisher.js';
import { IacAnalysisRequest } from '../types/iac.js';

const router: Router = Router();

router.post('/analyze-iac', async (req, res) => {
  const { filename, content } = req.body as IacAnalysisRequest;

  if (!filename || !content) {
    return res.status(400).json({ error: 'filename and content are required' });
  }

  try {
    await publishIacForAnalysis({ filename, content });
    res.status(202).json({ message: 'IaC sent for analysis' });
  } catch (err) {
    console.error('Error publishing IaC:', err);
    res.status(500).json({ error: 'Failed to publish IaC' });
  }
});

export default router;