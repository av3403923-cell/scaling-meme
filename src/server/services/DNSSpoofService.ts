import logger from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

export interface DNSSpoofRule {
  id: string;
  domain: string;
  targetIP: string;
  enabled: boolean;
  userId: string;
  createdAt: Date;
}

export class DNSSpoofService {
  private rules: Map<string, DNSSpoofRule> = new Map();

  addRule(userId: string, domain: string, targetIP: string): DNSSpoofRule {
    const id = uuidv4();
    const rule: DNSSpoofRule = {
      id,
      domain,
      targetIP,
      enabled: true,
      userId,
      createdAt: new Date(),
    };
    this.rules.set(id, rule);
    logger.info(`DNS spoof rule added: ${domain} -> ${targetIP}`);
    return rule;
  }

  getRules(userId: string): DNSSpoofRule[] {
    return Array.from(this.rules.values()).filter(r => r.userId === userId);
  }

  getRule(id: string, userId: string): DNSSpoofRule | null {
    const rule = this.rules.get(id);
    return rule && rule.userId === userId ? rule : null;
  }

  updateRule(id: string, userId: string, updates: Partial<DNSSpoofRule>): DNSSpoofRule | null {
    const rule = this.rules.get(id);
    if (rule && rule.userId === userId) {
      const updated = { ...rule, ...updates };
      this.rules.set(id, updated);
      logger.info(`DNS spoof rule updated: ${id}`);
      return updated;
    }
    return null;
  }

  deleteRule(id: string, userId: string): boolean {
    const rule = this.rules.get(id);
    if (rule && rule.userId === userId) {
      this.rules.delete(id);
      logger.info(`DNS spoof rule deleted: ${id}`);
      return true;
    }
    return false;
  }

  resolveHost(domain: string, userId: string): string | null {
    const userRules = this.getRules(userId).filter(r => r.enabled);
    const rule = userRules.find(r => r.domain === domain || domain.endsWith('.' + r.domain));
    return rule ? rule.targetIP : null;
  }
}

export const dnsSpoofService = new DNSSpoofService();