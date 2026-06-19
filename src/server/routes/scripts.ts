import { Router } from 'express';
import { AuthRequest } from '../middleware/auth';
import { scriptService } from '../services/ScriptService';
import logger from '../utils/logger';

const router = Router();

router.get('/', (req: AuthRequest, res) => {
  try {
    const scripts = scriptService.getScripts(req.userId!);
    res.json({ success: true, data: scripts });
  } catch (error) {
    logger.error('Get scripts error:', error);
    res.status(500).json({ error: 'Failed to fetch scripts' });
  }
});

router.post('/', (req: AuthRequest, res) => {
  try {
    const script = scriptService.addScript(req.userId!, req.body);
    res.status(201).json({ success: true, data: script });
  } catch (error) {
    logger.error('Add script error:', error);
    res.status(500).json({ error: 'Failed to add script' });
  }
});

router.get('/:id', (req: AuthRequest, res) => {
  try {
    const script = scriptService.getScript(req.params.id, req.userId!);
    if (!script) {
      return res.status(404).json({ error: 'Script not found' });
    }
    res.json({ success: true, data: script });
  } catch (error) {
    logger.error('Get script error:', error);
    res.status(500).json({ error: 'Failed to fetch script' });
  }
});

router.put('/:id', (req: AuthRequest, res) => {
  try {
    const script = scriptService.updateScript(req.params.id, req.userId!, req.body);
    if (!script) {
      return res.status(404).json({ error: 'Script not found' });
    }
    res.json({ success: true, data: script });
  } catch (error) {
    logger.error('Update script error:', error);
    res.status(500).json({ error: 'Failed to update script' });
  }
});

router.delete('/:id', (req: AuthRequest, res) => {
  try {
    const success = scriptService.deleteScript(req.params.id, req.userId!);
    if (!success) {
      return res.status(404).json({ error: 'Script not found' });
    }
    res.json({ success: true, message: 'Script deleted' });
  } catch (error) {
    logger.error('Delete script error:', error);
    res.status(500).json({ error: 'Failed to delete script' });
  }
});

router.post('/:id/execute', (req: AuthRequest, res) => {
  try {
    const result = scriptService.executeScript(req.params.id, req.userId!, req.body);
    res.json({ success: true, result });
  } catch (error) {
    logger.error('Execute script error:', error);
    res.status(500).json({ error: 'Failed to execute script' });
  }
});

export default router;