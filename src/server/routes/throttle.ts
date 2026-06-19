import { Router } from 'express';
import { AuthRequest } from '../middleware/auth';
import { throttleService } from '../services/ThrottleService';
import logger from '../utils/logger';

const router = Router();

router.get('/', (req: AuthRequest, res) => {
  try {
    const configs = throttleService.getConfigs(req.userId!);
    res.json({ success: true, data: configs });
  } catch (error) {
    logger.error('Get throttle configs error:', error);
    res.status(500).json({ error: 'Failed to fetch throttle configs' });
  }
});

router.post('/', (req: AuthRequest, res) => {
  try {
    const config = throttleService.addConfig(req.userId!, req.body);
    res.status(201).json({ success: true, data: config });
  } catch (error) {
    logger.error('Add throttle config error:', error);
    res.status(500).json({ error: 'Failed to add throttle config' });
  }
});

router.delete('/:id', (req: AuthRequest, res) => {
  try {
    const success = throttleService.deleteConfig(req.params.id, req.userId!);
    if (!success) {
      return res.status(404).json({ error: 'Config not found' });
    }
    res.json({ success: true, message: 'Config deleted' });
  } catch (error) {
    logger.error('Delete throttle config error:', error);
    res.status(500).json({ error: 'Failed to delete config' });
  }
});

export default router;