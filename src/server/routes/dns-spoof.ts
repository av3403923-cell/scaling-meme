import { Router } from 'express';
import { AuthRequest } from '../middleware/auth';
import { dnsSpoofService } from '../services/DNSSpoofService';
import logger from '../utils/logger';

const router = Router();

router.get('/', (req: AuthRequest, res) => {
  try {
    const rules = dnsSpoofService.getRules(req.userId!);
    res.json({ success: true, data: rules });
  } catch (error) {
    logger.error('Get DNS spoof rules error:', error);
    res.status(500).json({ error: 'Failed to fetch DNS spoof rules' });
  }
});

router.post('/', (req: AuthRequest, res) => {
  try {
    const { domain, targetIP } = req.body;
    const rule = dnsSpoofService.addRule(req.userId!, domain, targetIP);
    res.status(201).json({ success: true, data: rule });
  } catch (error) {
    logger.error('Add DNS spoof rule error:', error);
    res.status(500).json({ error: 'Failed to add DNS spoof rule' });
  }
});

router.get('/:id', (req: AuthRequest, res) => {
  try {
    const rule = dnsSpoofService.getRule(req.params.id, req.userId!);
    if (!rule) {
      return res.status(404).json({ error: 'Rule not found' });
    }
    res.json({ success: true, data: rule });
  } catch (error) {
    logger.error('Get DNS spoof rule error:', error);
    res.status(500).json({ error: 'Failed to fetch DNS spoof rule' });
  }
});

router.put('/:id', (req: AuthRequest, res) => {
  try {
    const rule = dnsSpoofService.updateRule(req.params.id, req.userId!, req.body);
    if (!rule) {
      return res.status(404).json({ error: 'Rule not found' });
    }
    res.json({ success: true, data: rule });
  } catch (error) {
    logger.error('Update DNS spoof rule error:', error);
    res.status(500).json({ error: 'Failed to update DNS spoof rule' });
  }
});

router.delete('/:id', (req: AuthRequest, res) => {
  try {
    const success = dnsSpoofService.deleteRule(req.params.id, req.userId!);
    if (!success) {
      return res.status(404).json({ error: 'Rule not found' });
    }
    res.json({ success: true, message: 'Rule deleted' });
  } catch (error) {
    logger.error('Delete DNS spoof rule error:', error);
    res.status(500).json({ error: 'Failed to delete DNS spoof rule' });
  }
});

export default router;