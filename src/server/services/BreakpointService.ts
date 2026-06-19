import logger from '../utils/logger';

export interface Breakpoint {
  id: string;
  name: string;
  enabled: boolean;
  condition: string; // URL pattern or regex
  action: 'pause' | 'modify' | 'block';
  matchType: 'contains' | 'regex' | 'exact';
  userId: string;
  createdAt: Date;
}

export class BreakpointService {
  private breakpoints: Map<string, Breakpoint> = new Map();

  addBreakpoint(userId: string, breakpoint: Omit<Breakpoint, 'id' | 'userId' | 'createdAt'>): Breakpoint {
    const id = Math.random().toString(36).substr(2, 9);
    const newBreakpoint: Breakpoint = {
      ...breakpoint,
      id,
      userId,
      createdAt: new Date(),
    };
    this.breakpoints.set(id, newBreakpoint);
    logger.info(`Breakpoint added: ${id}`);
    return newBreakpoint;
  }

  getBreakpoints(userId: string): Breakpoint[] {
    return Array.from(this.breakpoints.values()).filter(bp => bp.userId === userId);
  }

  getBreakpoint(id: string, userId: string): Breakpoint | null {
    const bp = this.breakpoints.get(id);
    return bp && bp.userId === userId ? bp : null;
  }

  updateBreakpoint(id: string, userId: string, updates: Partial<Breakpoint>): Breakpoint | null {
    const bp = this.breakpoints.get(id);
    if (bp && bp.userId === userId) {
      const updated = { ...bp, ...updates };
      this.breakpoints.set(id, updated);
      logger.info(`Breakpoint updated: ${id}`);
      return updated;
    }
    return null;
  }

  deleteBreakpoint(id: string, userId: string): boolean {
    const bp = this.breakpoints.get(id);
    if (bp && bp.userId === userId) {
      this.breakpoints.delete(id);
      logger.info(`Breakpoint deleted: ${id}`);
      return true;
    }
    return false;
  }

  checkBreakpoint(url: string, userId: string): Breakpoint | null {
    const userBreakpoints = this.getBreakpoints(userId).filter(bp => bp.enabled);
    
    for (const bp of userBreakpoints) {
      let matches = false;
      
      try {
        switch (bp.matchType) {
          case 'contains':
            matches = url.includes(bp.condition);
            break;
          case 'regex':
            matches = new RegExp(bp.condition).test(url);
            break;
          case 'exact':
            matches = url === bp.condition;
            break;
        }
      } catch (error) {
        logger.warn(`Invalid breakpoint condition: ${bp.condition}`);
      }

      if (matches) return bp;
    }

    return null;
  }
}

export const breakpointService = new BreakpointService();