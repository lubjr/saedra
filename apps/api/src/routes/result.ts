import { Router } from 'express';
import { resultStore } from '../listeners/resultListener.js';

const router: Router = Router();

router.get('/analysis-result/:filename', (req, res) => {
  const { filename } = req.params;
  const result = resultStore.get(filename);

  if (!result) {
    return res.status(404).json({ error: 'Resultado não encontrado' });
  }

  res.json(result);
});

export default router;