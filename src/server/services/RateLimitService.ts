import logger from '../utils/logger';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface ClientLimit {
  requests: number;
  resetTime: number;
}

export class RateLimitService {
  private config: RateLimitConfig;
  private clients: Map<string, ClientLimit> = new Map();

  constructor(maxRequests: number = 100, windowMs: number = 60000) {
    this.config = { maxRequests, windowMs };
    this.startCleanup();
  }

  isLimited(clientId: string): boolean {
    const now = Date.now();
    let limit = this.clients.get(clientId);

    if (!limit || now > limit.resetTime) {
      limit = {
        requests: 1,
        resetTime: now + this.config.windowMs,
      };
      this.clients.set(clientId, limit);
      return false;
    }

    limit.requests++;
    if (limit.requests > this.config.maxRequests) {
      logger.warn(`Rate limit exceeded for client ${clientId}`);
      return true;
    }

    return false;
  }

  getStatus(clientId: string) {
    const limit = this.clients.get(clientId);
    if (!limit) return null;

    const now = Date.now();
    return {
      remaining: Math.max(0, this.config.maxRequests - limit.requests),
      resetTime: limit.resetTime,
      resetsIn: Math.max(0, limit.resetTime - now),
    };
  }

  private startCleanup() {
    setInterval(() => {
      const now = Date.now();
      for (const [clientId, limit] of this.clients.entries()) {
        if (now > limit.resetTime) {
          this.clients.delete(clientId);
        }
      }
    }, 60000);
  }
}

export const rateLimitService = new RateLimitService();