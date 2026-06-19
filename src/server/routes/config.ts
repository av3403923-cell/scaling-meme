import { Router } from 'express';
import { AuthRequest } from '../middleware/auth';
import { database } from '../database/db';
import logger from '../utils/logger';

const router = Router();

// Get configuration
router.get('/', (req: AuthRequest, res) => {
  try {
    const config = database.getConfig(req.userId!);
    res.json({ success: true, data: config });
  } catch (error) {
    logger.error('Get config error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update configuration
router.put('/', (req: AuthRequest, res) => {
  try {
    const config = database.updateConfig(req.userId!, req.body);
    res.json({ success: true, data: config });
  } catch (error) {
    logger.error('Update config error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Manage certificates
router.post('/certificates', (req: AuthRequest, res) => {
  try {
    // Implementar lógica de certificado
    res.json({ success: true, message: 'Certificate uploaded' });
  } catch (error) {
    logger.error('Upload certificate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
