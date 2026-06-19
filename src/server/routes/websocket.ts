import { Router } from 'express';
import { AuthRequest } from '../middleware/auth';
import { webSocketInterceptService } from '../services/WebSocketInterceptService';
import logger from '../utils/logger';

const router = Router();

router.get('/', (req: AuthRequest, res) => {
  try {
    const connections = webSocketInterceptService.getConnections(req.userId!);
    res.json({ success: true, data: connections });
  } catch (error) {
    logger.error('Get WebSocket connections error:', error);
    res.status(500).json({ error: 'Failed to fetch WebSocket connections' });
  }
});

router.get('/:id', (req: AuthRequest, res) => {
  try {
    const connection = webSocketInterceptService.getConnection(req.params.id, req.userId!);
    if (!connection) {
      return res.status(404).json({ error: 'Connection not found' });
    }
    res.json({ success: true, data: connection });
  } catch (error) {
    logger.error('Get WebSocket connection error:', error);
    res.status(500).json({ error: 'Failed to fetch WebSocket connection' });
  }
});

router.post('/:id/close', (req: AuthRequest, res) => {
  try {
    const success = webSocketInterceptService.closeConnection(req.params.id, req.userId!);
    if (!success) {
      return res.status(404).json({ error: 'Connection not found' });
    }
    res.json({ success: true, message: 'Connection closed' });
  } catch (error) {
    logger.error('Close WebSocket connection error:', error);
    res.status(500).json({ error: 'Failed to close connection' });
  }
});

router.delete('/:id', (req: AuthRequest, res) => {
  try {
    const success = webSocketInterceptService.deleteConnection(req.params.id, req.userId!);
    if (!success) {
      return res.status(404).json({ error: 'Connection not found' });
    }
    res.json({ success: true, message: 'Connection deleted' });
  } catch (error) {
    logger.error('Delete WebSocket connection error:', error);
    res.status(500).json({ error: 'Failed to delete connection' });
  }
});

export default router;