import { HttpRequest, AnalyticsData } from '../types';
import logger from '../utils/logger';

export class AnalyticsService {
  static calculateStats(requests: HttpRequest[]): AnalyticsData {
    if (requests.length === 0) {
      return {
        totalRequests: 0,
        totalResponseTime: 0,
        averageResponseTime: 0,
        domainStats: [],
        statusCodeStats: [],
        methodStats: [],
        bandwidthUsed: 0,
        successRate: 0,
      };
    }

    const totalRequests = requests.length;
    const totalResponseTime = requests.reduce((sum, r) => sum + (r.duration || 0), 0);
    const averageResponseTime = totalResponseTime / totalRequests;
    const bandwidthUsed = requests.reduce((sum, r) => sum + (r.size || 0), 0);
    const successfulRequests = requests.filter(r => r.statusCode && r.statusCode < 400).length;
    const successRate = (successfulRequests / totalRequests) * 100;

    const domainStats = this.calculateDomainStats(requests);
    const statusCodeStats = this.calculateStatusCodeStats(requests);
    const methodStats = this.calculateMethodStats(requests);

    return {
      totalRequests,
      totalResponseTime,
      averageResponseTime,
      domainStats,
      statusCodeStats,
      methodStats,
      bandwidthUsed,
      successRate,
    };
  }

  private static calculateDomainStats(requests: HttpRequest[]) {
    const domainsMap: Record<string, any> = {};

    requests.forEach(req => {
      const domain = req.domain || 'unknown';
      if (!domainsMap[domain]) {
        domainsMap[domain] = {
          domain,
          requestCount: 0,
          averageResponseTime: 0,
          totalBandwidth: 0,
          requestTimes: [],
        };
      }
      domainsMap[domain].requestCount++;
      domainsMap[domain].totalBandwidth += req.size || 0;
      domainsMap[domain].requestTimes.push(req.duration || 0);
    });

    return Object.values(domainsMap).map((stat: any) => ({
      domain: stat.domain,
      requestCount: stat.requestCount,
      averageResponseTime: stat.requestTimes.reduce((a: number, b: number) => a + b, 0) / stat.requestTimes.length,
      totalBandwidth: stat.totalBandwidth,
    }));
  }

  private static calculateStatusCodeStats(requests: HttpRequest[]) {
    const statusMap: Record<number, number> = {};

    requests.forEach(req => {
      const code = req.statusCode || 0;
      statusMap[code] = (statusMap[code] || 0) + 1;
    });

    return Object.entries(statusMap).map(([code, count]) => ({
      code: parseInt(code),
      count,
      description: this.getStatusDescription(parseInt(code)),
    }));
  }

  private static calculateMethodStats(requests: HttpRequest[]) {
    const methodMap: Record<string, any> = {};

    requests.forEach(req => {
      const method = req.method;
      if (!methodMap[method]) {
        methodMap[method] = {
          method,
          count: 0,
          responseTimes: [],
        };
      }
      methodMap[method].count++;
      methodMap[method].responseTimes.push(req.duration || 0);
    });

    return Object.values(methodMap).map((stat: any) => ({
      method: stat.method,
      count: stat.count,
      averageResponseTime: stat.responseTimes.reduce((a: number, b: number) => a + b, 0) / stat.responseTimes.length,
    }));
  }

  private static getStatusDescription(code: number): string {
    const descriptions: Record<number, string> = {
      200: 'OK',
      201: 'Created',
      204: 'No Content',
      301: 'Moved Permanently',
      302: 'Found',
      304: 'Not Modified',
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      500: 'Internal Server Error',
      502: 'Bad Gateway',
      503: 'Service Unavailable',
    };
    return descriptions[code] || 'Unknown';
  }
}