import logger from '../utils/logger';
import { HttpRequest } from '../types';

export interface PerformanceMetrics {
  totalRequests: number;
  averageResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  p50ResponseTime: number; // Median
  p95ResponseTime: number;
  p99ResponseTime: number;
  requestsPerSecond: number;
  bandwidthPerSecond: number;
  slowestRequests: HttpRequest[];
}

export class PerformanceProfiler {
  calculateMetrics(requests: HttpRequest[], timeWindowMs: number = 60000): PerformanceMetrics {
    if (requests.length === 0) {
      return {
        totalRequests: 0,
        averageResponseTime: 0,
        minResponseTime: 0,
        maxResponseTime: 0,
        p50ResponseTime: 0,
        p95ResponseTime: 0,
        p99ResponseTime: 0,
        requestsPerSecond: 0,
        bandwidthPerSecond: 0,
        slowestRequests: [],
      };
    }

    const durations = requests.map(r => r.duration || 0).sort((a, b) => a - b);
    const totalRequests = requests.length;
    const averageResponseTime = durations.reduce((a, b) => a + b, 0) / totalRequests;
    const minResponseTime = durations[0];
    const maxResponseTime = durations[durations.length - 1];
    const p50ResponseTime = durations[Math.floor(durations.length * 0.5)];
    const p95ResponseTime = durations[Math.floor(durations.length * 0.95)];
    const p99ResponseTime = durations[Math.floor(durations.length * 0.99)];

    const requestsPerSecond = (totalRequests / timeWindowMs) * 1000;
    const totalBandwidth = requests.reduce((sum, r) => sum + (r.size || 0), 0);
    const bandwidthPerSecond = (totalBandwidth / timeWindowMs) * 1000;

    const slowestRequests = requests
      .sort((a, b) => (b.duration || 0) - (a.duration || 0))
      .slice(0, 10);

    return {
      totalRequests,
      averageResponseTime,
      minResponseTime,
      maxResponseTime,
      p50ResponseTime,
      p95ResponseTime,
      p99ResponseTime,
      requestsPerSecond,
      bandwidthPerSecond,
      slowestRequests,
    };
  }
}

export const performanceProfiler = new PerformanceProfiler();