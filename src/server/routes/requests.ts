import { Router } from 'express';
import { AuthRequest } from '../middleware/auth';
import { database } from '../database/db';
import logger from '../utils/logger';

const router = Router();

// Get all requests for user
router.get('/', (req: AuthRequest, res) => {
  try {
    const requests = database.getRequestsByUserId(req.userId!);
    res.json({
      success: true,
      data: requests,
      count: requests.length,
    });
  } catch (error) {
    logger.error('Get requests error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific request
router.get('/:id', (req: AuthRequest, res) => {
  try {
    const request = database.getRequestById(req.params.id, req.userId!);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.json({ success: true, data: request });
  } catch (error) {
    logger.error('Get request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete request
router.delete('/:id', (req: AuthRequest, res) => {
  try {
    database.deleteRequest(req.params.id, req.userId!);
    res.json({ success: true, message: 'Request deleted' });
  } catch (error) {
    logger.error('Delete request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Replay request
router.post('/:id/replay', async (req: AuthRequest, res) => {
  try {
    const originalRequest = database.getRequestById(req.params.id, req.userId!);
    if (!originalRequest) {
      return res.status(404).json({ error: 'Request not found' });
    }
    // Implementar logic de replay
    res.json({ success: true, message: 'Request replayed' });
  } catch (error) {
    logger.error('Replay request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
