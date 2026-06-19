import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { database } from '../database/db';
import { FilterService } from '../services/FilterService';
import { ExportService } from '../services/ExportService';
import logger from '../utils/logger';

export class RequestController {
  static async getAllRequests(req: AuthRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const skip = (page - 1) * limit;

      let requests = database.getRequestsByUserId(req.userId!);

      if (req.query.filter) {
        const filterOptions = JSON.parse(req.query.filter as string);
        requests = FilterService.filter(requests, filterOptions);
      }

      if (req.query.search) {
        requests = FilterService.search(requests, req.query.search as string);
      }

      const total = requests.length;
      const paginatedRequests = requests.slice(skip, skip + limit);

      res.json({
        success: true,
        data: paginatedRequests,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      });
    } catch (error) {
      logger.error('Get requests error:', error);
      res.status(500).json({ error: 'Failed to fetch requests' });
    }
  }

  static async getRequestDetails(req: AuthRequest, res: Response) {
    try {
      const request = database.getRequestById(req.params.id, req.userId!);
      if (!request) {
        return res.status(404).json({ error: 'Request not found' });
      }
      res.json({ success: true, data: request });
    } catch (error) {
      logger.error('Get request details error:', error);
      res.status(500).json({ error: 'Failed to fetch request' });
    }
  }

  static async deleteRequest(req: AuthRequest, res: Response) {
    try {
      const success = database.deleteRequest(req.params.id, req.userId!);
      if (!success) {
        return res.status(404).json({ error: 'Request not found' });
      }
      res.json({ success: true, message: 'Request deleted' });
    } catch (error) {
      logger.error('Delete request error:', error);
      res.status(500).json({ error: 'Failed to delete request' });
    }
  }

  static async clearAllRequests(req: AuthRequest, res: Response) {
    try {
      database.clearRequestsByUserId(req.userId!);
      res.json({ success: true, message: 'All requests cleared' });
    } catch (error) {
      logger.error('Clear requests error:', error);
      res.status(500).json({ error: 'Failed to clear requests' });
    }
  }

  static async exportRequests(req: AuthRequest, res: Response) {
    try {
      const format = req.query.format as string || 'json';
      let requests = database.getRequestsByUserId(req.userId!);

      if (req.query.filter) {
        const filterOptions = JSON.parse(req.query.filter as string);
        requests = FilterService.filter(requests, filterOptions);
      }

      let content: string;
      let contentType: string;
      let filename = `requests-${Date.now()}`;

      switch (format) {
        case 'csv':
          content = ExportService.toCSV(requests);
          contentType = 'text/csv';
          filename += '.csv';
          break;
        case 'har':
          content = JSON.stringify(ExportService.toHAR(requests), null, 2);
          contentType = 'application/json';
          filename += '.har';
          break;
        case 'json':
        default:
          content = ExportService.toJSON(requests);
          contentType = 'application/json';
          filename += '.json';
      }

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(content);
    } catch (error) {
      logger.error('Export requests error:', error);
      res.status(500).json({ error: 'Failed to export requests' });
    }
  }
}