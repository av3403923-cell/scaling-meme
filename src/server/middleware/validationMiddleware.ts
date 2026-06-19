import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const validateRequestBody = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'GET' || req.method === 'HEAD') {
    return next();
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    logger.warn(`Empty request body for ${req.method} ${req.path}`);
  }

  next();
};

export const validateContentType = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    const contentType = req.headers['content-type'];
    if (!contentType) {
      logger.warn(`Missing Content-Type header for ${req.method} ${req.path}`);
    }
  }
  next();
};