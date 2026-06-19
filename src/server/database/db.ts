import { v4 as uuidv4 } from 'uuid';
import { User, HttpRequest, AnalyticsData } from '../types';

interface StoredUser extends User {}
interface StoredRequest extends HttpRequest {}

class Database {
  private users: Map<string, StoredUser> = new Map();
  private requests: Map<string, StoredRequest> = new Map();
  private userRequests: Map<string, string[]> = new Map();
  private configs: Map<string, any> = new Map();

  // User operations
  createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const user: User = {
      id: uuidv4(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    this.userRequests.set(user.id, []);
    this.configs.set(user.id, { port: 8080, host: 'localhost' });
    return user;
  }

  getUserByUsername(username: string): User | null {
    for (const user of this.users.values()) {
      if (user.username === username) return user;
    }
    return null;
  }

  // Request operations
  saveRequest(request: Omit<HttpRequest, 'id'>): HttpRequest {
    const newRequest: HttpRequest = {
      ...request,
      id: uuidv4(),
    };
    this.requests.set(newRequest.id, newRequest);
    
    const userReqs = this.userRequests.get(request.userId) || [];
    userReqs.push(newRequest.id);
    this.userRequests.set(request.userId, userReqs);
    
    return newRequest;
  }

  getRequestsByUserId(userId: string): HttpRequest[] {
    const requestIds = this.userRequests.get(userId) || [];
    return requestIds
      .map(id => this.requests.get(id))
      .filter((req): req is HttpRequest => req !== undefined)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getRequestById(requestId: string, userId: string): HttpRequest | null {
    const request = this.requests.get(requestId);
    if (request && request.userId === userId) {
      return request;
    }
    return null;
  }

  deleteRequest(requestId: string, userId: string): boolean {
    const request = this.requests.get(requestId);
    if (request && request.userId === userId) {
      this.requests.delete(requestId);
      const userReqs = this.userRequests.get(userId) || [];
      this.userRequests.set(
        userId,
        userReqs.filter(id => id !== requestId)
      );
      return true;
    }
    return false;
  }

  // Analytics
  getAnalyticsStats(userId: string): AnalyticsData {
    const requests = this.getRequestsByUserId(userId);
    const totalRequests = requests.length;
    const totalResponseTime = requests.reduce((sum, r) => sum + (r.duration || 0), 0);
    const averageResponseTime = totalRequests > 0 ? totalResponseTime / totalRequests : 0;
    const successRate =
      totalRequests > 0
        ? ((requests.filter(r => r.statusCode && r.statusCode < 400).length / totalRequests) * 100)
        : 0;
    const bandwidthUsed = requests.reduce((sum, r) => sum + (r.size || 0), 0);

    return {
      totalRequests,
      totalResponseTime,
      averageResponseTime,
      domainStats: [],
      statusCodeStats: [],
      methodStats: [],
      bandwidthUsed,
      successRate,
    };
  }

  getStatsByDomain(userId: string) {
    const requests = this.getRequestsByUserId(userId);
    const statsByDomain: any = {};

    requests.forEach(req => {
      const domain = req.domain || 'unknown';
      if (!statsByDomain[domain]) {
        statsByDomain[domain] = {
          domain,
          requestCount: 0,
          totalResponseTime: 0,
          totalBandwidth: 0,
        };
      }
      statsByDomain[domain].requestCount++;
      statsByDomain[domain].totalResponseTime += req.duration || 0;
      statsByDomain[domain].totalBandwidth += req.size || 0;
    });

    return Object.values(statsByDomain);
  }

  getStatsByStatus(userId: string) {
    const requests = this.getRequestsByUserId(userId);
    const statsByStatus: any = {};

    requests.forEach(req => {
      const status = req.statusCode || 0;
      if (!statsByStatus[status]) {
        statsByStatus[status] = { code: status, count: 0 };
      }
      statsByStatus[status].count++;
    });

    return Object.values(statsByStatus);
  }

  // Config
  getConfig(userId: string) {
    return this.configs.get(userId) || {};
  }

  updateConfig(userId: string, config: any) {
    this.configs.set(userId, config);
    return config;
  }
}

export const database = new Database();
