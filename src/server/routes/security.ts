import { Router } from 'express';
import { AuthRequest } from '../middleware/auth';
import { database } from '../database/db';
import { securityScanner } from '../services/SecurityScanner';
import logger from '../utils/logger';

const router = Router();

router.get('/scan', (req: AuthRequest, res) => {
  try {
    const requestId = req.query.requestId as string;
    const request = database.getRequestById(requestId, req.userId!);
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const issues = securityScanner.scanRequest(request);
    res.json({ success: true, data: issues });
  } catch (error) {
    logger.error('Security scan error:', error);
    res.status(500).json({ error: 'Failed to scan security' });
  }
});

router.get('/scan-all', (req: AuthRequest, res) => {
  try {
    const requests = database.getRequestsByUserId(req.userId!);
    const allIssues = requests.flatMap(req => securityScanner.scanRequest(req));
    res.json({ success: true, data: allIssues, totalIssues: allIssues.length });
  } catch (error) {
    logger.error('Scan all security error:', error);
    res.status(500).json({ error: 'Failed to scan all security' });
  }
});

export default router;