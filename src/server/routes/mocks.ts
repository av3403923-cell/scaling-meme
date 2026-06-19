import { Router } from 'express';
import { AuthRequest } from '../middleware/auth';
import { mockService } from '../services/MockService';
import logger from '../utils/logger';

const router = Router();

router.get('/', (req: AuthRequest, res) => {
  try {
    const mocks = mockService.getMocks(req.userId!);
    res.json({ success: true, data: mocks });
  } catch (error) {
    logger.error('Get mocks error:', error);
    res.status(500).json({ error: 'Failed to fetch mocks' });
  }
});

router.post('/', (req: AuthRequest, res) => {
  try {
    const mock = mockService.addMock(req.userId!, req.body);
    res.status(201).json({ success: true, data: mock });
  } catch (error) {
    logger.error('Add mock error:', error);
    res.status(500).json({ error: 'Failed to add mock' });
  }
});

router.get('/:id', (req: AuthRequest, res) => {
  try {
    const mock = mockService.getMock(req.params.id, req.userId!);
    if (!mock) {
      return res.status(404).json({ error: 'Mock not found' });
    }
    res.json({ success: true, data: mock });
  } catch (error) {
    logger.error('Get mock error:', error);
    res.status(500).json({ error: 'Failed to fetch mock' });
  }
});

router.put('/:id', (req: AuthRequest, res) => {
  try {
    const mock = mockService.updateMock(req.params.id, req.userId!, req.body);
    if (!mock) {
      return res.status(404).json({ error: 'Mock not found' });
    }
    res.json({ success: true, data: mock });
  } catch (error) {
    logger.error('Update mock error:', error);
    res.status(500).json({ error: 'Failed to update mock' });
  }
});

router.delete('/:id', (req: AuthRequest, res) => {
  try {
    const success = mockService.deleteMock(req.params.id, req.userId!);
    if (!success) {
      return res.status(404).json({ error: 'Mock not found' });
    }
    res.json({ success: true, message: 'Mock deleted' });
  } catch (error) {
    logger.error('Delete mock error:', error);
    res.status(500).json({ error: 'Failed to delete mock' });
  }
});

export default router;