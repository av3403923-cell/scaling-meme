import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import logger from '../utils/logger';

export interface AuthRequest extends Request {
  userId?: string;
  username?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    req.userId = payload.userId;
    req.username = payload.username;

    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};
