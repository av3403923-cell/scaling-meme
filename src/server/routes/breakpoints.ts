import { Router } from 'express';
import { AuthRequest } from '../middleware/auth';
import { breakpointService } from '../services/BreakpointService';
import logger from '../utils/logger';

const router = Router();

router.get('/', (req: AuthRequest, res) => {
  try {
    const breakpoints = breakpointService.getBreakpoints(req.userId!);
    res.json({ success: true, data: breakpoints });
  } catch (error) {
    logger.error('Get breakpoints error:', error);
    res.status(500).json({ error: 'Failed to fetch breakpoints' });
  }
});

router.post('/', (req: AuthRequest, res) => {
  try {
    const { name, condition, action, matchType } = req.body;
    const breakpoint = breakpointService.addBreakpoint(req.userId!, {
      name,
      condition,
      action,
      matchType,
      enabled: true,
    });
    res.status(201).json({ success: true, data: breakpoint });
  } catch (error) {
    logger.error('Add breakpoint error:', error);
    res.status(500).json({ error: 'Failed to add breakpoint' });
  }
});

router.get('/:id', (req: AuthRequest, res) => {
  try {
    const breakpoint = breakpointService.getBreakpoint(req.params.id, req.userId!);
    if (!breakpoint) {
      return res.status(404).json({ error: 'Breakpoint not found' });
    }
    res.json({ success: true, data: breakpoint });
  } catch (error) {
    logger.error('Get breakpoint error:', error);
    res.status(500).json({ error: 'Failed to fetch breakpoint' });
  }
});

router.put('/:id', (req: AuthRequest, res) => {
  try {
    const breakpoint = breakpointService.updateBreakpoint(req.params.id, req.userId!, req.body);
    if (!breakpoint) {
      return res.status(404).json({ error: 'Breakpoint not found' });
    }
    res.json({ success: true, data: breakpoint });
  } catch (error) {
    logger.error('Update breakpoint error:', error);
    res.status(500).json({ error: 'Failed to update breakpoint' });
  }
});

router.delete('/:id', (req: AuthRequest, res) => {
  try {
    const success = breakpointService.deleteBreakpoint(req.params.id, req.userId!);
    if (!success) {
      return res.status(404).json({ error: 'Breakpoint not found' });
    }
    res.json({ success: true, message: 'Breakpoint deleted' });
  } catch (error) {
    logger.error('Delete breakpoint error:', error);
    res.status(500).json({ error: 'Failed to delete breakpoint' });
  }
});

export default router;