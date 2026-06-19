import { Router } from 'express';
import { AuthRequest } from '../middleware/auth';
import { database } from '../database/db';
import logger from '../utils/logger';

const router = Router();

// Get analytics stats
router.get('/stats', (req: AuthRequest, res) => {
  try {
    const stats = database.getAnalyticsStats(req.userId!);
    res.json({ success: true, data: stats });
  } catch (error) {
    logger.error('Get analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get stats by domain
router.get('/by-domain', (req: AuthRequest, res) => {
  try {
    const stats = database.getStatsByDomain(req.userId!);
    res.json({ success: true, data: stats });
  } catch (error) {
    logger.error('Get domain stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get stats by status code
router.get('/by-status', (req: AuthRequest, res) => {
  try {
    const stats = database.getStatsByStatus(req.userId!);
    res.json({ success: true, data: stats });
  } catch (error) {
    logger.error('Get status stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
