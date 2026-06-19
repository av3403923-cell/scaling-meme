import { Router } from 'express';
import { AuthRequest } from '../middleware/auth';
import { interceptionService } from '../services/InterceptionService';
import logger from '../utils/logger';

const router = Router();

router.get('/', (req: AuthRequest, res) => {
  try {
    const intercepted = interceptionService.getAllIntercepted();
    res.json({ success: true, data: intercepted });
  } catch (error) {
    logger.error('Get intercepted error:', error);
    res.status(500).json({ error: 'Failed to fetch intercepted requests' });
  }
});

router.get('/:id', (req: AuthRequest, res) => {
  try {
    const intercepted = interceptionService.getInterceptedRequest(req.params.id);
    if (!intercepted) {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.json({ success: true, data: intercepted });
  } catch (error) {
    logger.error('Get intercepted request error:', error);
    res.status(500).json({ error: 'Failed to fetch request' });
  }
});

router.post('/:id/pause', (req: AuthRequest, res) => {
  try {
    const success = interceptionService.pauseRequest(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.json({ success: true, message: 'Request paused' });
  } catch (error) {
    logger.error('Pause request error:', error);
    res.status(500).json({ error: 'Failed to pause request' });
  }
});

router.post('/:id/resume', (req: AuthRequest, res) => {
  try {
    const success = interceptionService.resumeRequest(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.json({ success: true, message: 'Request resumed' });
  } catch (error) {
    logger.error('Resume request error:', error);
    res.status(500).json({ error: 'Failed to resume request' });
  }
});

router.put('/:id/modify', (req: AuthRequest, res) => {
  try {
    const { type, modifications } = req.body;
    const success = type === 'request' 
      ? interceptionService.modifyRequest(req.params.id, modifications)
      : interceptionService.modifyResponse(req.params.id, modifications);
    
    if (!success) {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.json({ success: true, message: 'Request modified' });
  } catch (error) {
    logger.error('Modify request error:', error);
    res.status(500).json({ error: 'Failed to modify request' });
  }
});

router.post('/clear', (req: AuthRequest, res) => {
  try {
    interceptionService.clearIntercepted();
    res.json({ success: true, message: 'All intercepted requests cleared' });
  } catch (error) {
    logger.error('Clear intercepted error:', error);
    res.status(500).json({ error: 'Failed to clear requests' });
  }
});

export default router;