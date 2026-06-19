import { Request, Response, NextFunction } from 'express';
import { rateLimitService } from '../services/RateLimitService';
import logger from '../utils/logger';

export const rateLimitMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const clientId = req.ip || 'unknown';

  if (rateLimitService.isLimited(clientId)) {
    const status = rateLimitService.getStatus(clientId);
    res.set('Retry-After', String(Math.ceil((status?.resetsIn || 0) / 1000)));
    return res.status(429).json({
      error: 'Too many requests',
      retryAfter: status?.resetsIn,
    });
  }

  const status = rateLimitService.getStatus(clientId);
  res.set('X-RateLimit-Remaining', String(status?.remaining || 0));
  res.set('X-RateLimit-Reset', String(status?.resetTime || 0));

  next();
};
