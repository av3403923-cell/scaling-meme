import logger from '../utils/logger';

export interface ThrottleConfig {
  id: string;
  name: string;
  enabled: boolean;
  urlPattern: string;
  bandwidth?: number; // bytes per second
  latency?: number; // ms
  packetLoss?: number; // percentage 0-100
  userId: string;
}

export class ThrottleService {
  private configs: Map<string, ThrottleConfig> = new Map();

  addConfig(userId: string, config: Omit<ThrottleConfig, 'id' | 'userId'>): ThrottleConfig {
    const id = Math.random().toString(36).substr(2, 9);
    const newConfig: ThrottleConfig = {
      ...config,
      id,
      userId,
    };
    this.configs.set(id, newConfig);
    logger.info(`Throttle config added: ${id}`);
    return newConfig;
  }

  getConfigs(userId: string): ThrottleConfig[] {
    return Array.from(this.configs.values()).filter(c => c.userId === userId);
  }

  findConfig(url: string, userId: string): ThrottleConfig | null {
    const userConfigs = this.getConfigs(userId).filter(c => c.enabled);
    return userConfigs.find(c => url.includes(c.urlPattern)) || null;
  }

  deleteConfig(id: string, userId: string): boolean {
    const config = this.configs.get(id);
    if (config && config.userId === userId) {
      this.configs.delete(id);
      logger.info(`Throttle config deleted: ${id}`);
      return true;
    }
    return false;
  }

  async applyThrottle(data: Buffer, config: ThrottleConfig): Promise<Buffer> {
    if (config.latency) {
      await new Promise(resolve => setTimeout(resolve, config.latency));
    }

    if (config.packetLoss && Math.random() * 100 < config.packetLoss) {
      logger.info(`Packet dropped: ${config.name}`);
      return Buffer.alloc(0);
    }

    if (config.bandwidth) {
      const delayMs = (data.length / config.bandwidth) * 1000;
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }

    return data;
  }
}

export const throttleService = new ThrottleService();