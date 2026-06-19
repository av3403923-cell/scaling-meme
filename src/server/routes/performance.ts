import { Router } from 'express';
import { AuthRequest } from '../middleware/auth';
import { database } from '../database/db';
import { performanceProfiler } from '../services/PerformanceProfiler';
import logger from '../utils/logger';

const router = Router();

router.get('/metrics', (req: AuthRequest, res) => {
  try {
    const timeWindow = parseInt(req.query.timeWindow as string) || 60000;
    const requests = database.getRequestsByUserId(req.userId!);
    const metrics = performanceProfiler.calculateMetrics(requests, timeWindow);
    res.json({ success: true, data: metrics });
  } catch (error) {
    logger.error('Get performance metrics error:', error);
    res.status(500).json({ error: 'Failed to fetch performance metrics' });
  }
});

router.get('/slowest', (req: AuthRequest, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const requests = database.getRequestsByUserId(req.userId!)
      .sort((a, b) => (b.duration || 0) - (a.duration || 0))
      .slice(0, limit);
    res.json({ success: true, data: requests });
  } catch (error) {
    logger.error('Get slowest requests error:', error);
    res.status(500).json({ error: 'Failed to fetch slowest requests' });
  }
});

export default router;