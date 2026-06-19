import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { certificateService } from '../services/CertificateService';
import logger from '../utils/logger';

export class CertificateController {
  static async generateCertificate(req: AuthRequest, res: Response) {
    try {
      const { domain } = req.body;
      if (!domain) {
        return res.status(400).json({ error: 'Domain is required' });
      }

      const cert = await certificateService.generateCertificate(domain);
      res.status(201).json({ success: true, data: cert });
    } catch (error) {
      logger.error('Generate certificate error:', error);
      res.status(500).json({ error: 'Failed to generate certificate' });
    }
  }

  static async getCertificates(req: AuthRequest, res: Response) {
    try {
      const certs = certificateService.getAllCertificates();
      res.json({ success: true, data: certs });
    } catch (error) {
      logger.error('Get certificates error:', error);
      res.status(500).json({ error: 'Failed to fetch certificates' });
    }
  }

  static async deleteCertificate(req: AuthRequest, res: Response) {
    try {
      const { domain } = req.params;
      const success = certificateService.deleteCertificate(domain);
      if (!success) {
        return res.status(404).json({ error: 'Certificate not found' });
      }
      res.json({ success: true, message: 'Certificate deleted' });
    } catch (error) {
      logger.error('Delete certificate error:', error);
      res.status(500).json({ error: 'Failed to delete certificate' });
    }
  }
}