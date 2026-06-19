import logger from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

export interface MockRule {
  id: string;
  name: string;
  enabled: boolean;
  urlPattern: string;
  matchType: 'contains' | 'regex' | 'exact';
  method?: string;
  statusCode: number;
  responseHeaders: Record<string, string>;
  responseBody: string | object;
  delay?: number; // ms
  userId: string;
  createdAt: Date;
}

export class MockService {
  private mocks: Map<string, MockRule> = new Map();

  addMock(userId: string, mock: Omit<MockRule, 'id' | 'userId' | 'createdAt'>): MockRule {
    const id = uuidv4();
    const newMock: MockRule = {
      ...mock,
      id,
      userId,
      createdAt: new Date(),
    };
    this.mocks.set(id, newMock);
    logger.info(`Mock added: ${id}`);
    return newMock;
  }

  getMocks(userId: string): MockRule[] {
    return Array.from(this.mocks.values()).filter(m => m.userId === userId);
  }

  getMock(id: string, userId: string): MockRule | null {
    const mock = this.mocks.get(id);
    return mock && mock.userId === userId ? mock : null;
  }

  updateMock(id: string, userId: string, updates: Partial<MockRule>): MockRule | null {
    const mock = this.mocks.get(id);
    if (mock && mock.userId === userId) {
      const updated = { ...mock, ...updates };
      this.mocks.set(id, updated);
      logger.info(`Mock updated: ${id}`);
      return updated;
    }
    return null;
  }

  deleteMock(id: string, userId: string): boolean {
    const mock = this.mocks.get(id);
    if (mock && mock.userId === userId) {
      this.mocks.delete(id);
      logger.info(`Mock deleted: ${id}`);
      return true;
    }
    return false;
  }

  findMock(url: string, method: string, userId: string): MockRule | null {
    const userMocks = this.getMocks(userId).filter(m => m.enabled && (!m.method || m.method === method));
    
    for (const mock of userMocks) {
      let matches = false;
      
      try {
        switch (mock.matchType) {
          case 'contains':
            matches = url.includes(mock.urlPattern);
            break;
          case 'regex':
            matches = new RegExp(mock.urlPattern).test(url);
            break;
          case 'exact':
            matches = url === mock.urlPattern;
            break;
        }
      } catch (error) {
        logger.warn(`Invalid mock pattern: ${mock.urlPattern}`);
      }

      if (matches) return mock;
    }

    return null;
  }
}

export const mockService = new MockService();