import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { database } from '../database/db';
import { AnalyticsService } from '../services/AnalyticsService';
import logger from '../utils/logger';

export class AnalyticsController {
  static async getStats(req: AuthRequest, res: Response) {
    try {
      const requests = database.getRequestsByUserId(req.userId!);
      const stats = AnalyticsService.calculateStats(requests);
      res.json({ success: true, data: stats });
    } catch (error) {
      logger.error('Get stats error:', error);
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  }

  static async getTimeSeries(req: AuthRequest, res: Response) {
    try {
      const requests = database.getRequestsByUserId(req.userId!);
      const intervalMs = parseInt(req.query.interval as string) || 60000;

      const timeSeries: Record<string, number> = {};
      requests.forEach(req => {
        const time = new Date(Math.floor(req.timestamp.getTime() / intervalMs) * intervalMs);
        const key = time.toISOString();
        timeSeries[key] = (timeSeries[key] || 0) + 1;
      });

      const data = Object.entries(timeSeries).map(([time, count]) => ({ time, count }));
      res.json({ success: true, data });
    } catch (error) {
      logger.error('Get time series error:', error);
      res.status(500).json({ error: 'Failed to fetch time series' });
    }
  }

  static async getTopDomains(req: AuthRequest, res: Response) {
    try {
      const requests = database.getRequestsByUserId(req.userId!);
      const limit = parseInt(req.query.limit as string) || 10;

      const domainMap: Record<string, number> = {};
      requests.forEach(req => {
        const domain = req.domain || 'unknown';
        domainMap[domain] = (domainMap[domain] || 0) + 1;
      });

      const topDomains = Object.entries(domainMap)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([domain, count]) => ({ domain, count }));

      res.json({ success: true, data: topDomains });
    } catch (error) {
      logger.error('Get top domains error:', error);
      res.status(500).json({ error: 'Failed to fetch top domains' });
    }
  }
}