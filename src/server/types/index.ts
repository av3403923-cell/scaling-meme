export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JWTPayload {
  userId: string;
  username: string;
  iat: number;
  exp: number;
}

export interface HttpRequest {
  id: string;
  method: string;
  url: string;
  headers: Record<string, string | string[]>;
  body?: string | Buffer;
  timestamp: Date;
  statusCode?: number;
  responseHeaders?: Record<string, string | string[]>;
  responseBody?: string | Buffer;
  duration?: number;
  size?: number;
  domain?: string;
  path?: string;
  query?: string;
  userId: string;
  isMocked?: boolean;
  mockResponse?: string;
}

export interface AnalyticsData {
  totalRequests: number;
  totalResponseTime: number;
  averageResponseTime: number;
  domainStats: DomainStat[];
  statusCodeStats: StatusCodeStat[];
  methodStats: MethodStat[];
  bandwidthUsed: number;
  successRate: number;
}

export interface DomainStat {
  domain: string;
  requestCount: number;
  averageResponseTime: number;
  totalBandwidth: number;
}

export interface StatusCodeStat {
  code: number;
  count: number;
  description: string;
}

export interface MethodStat {
  method: string;
  count: number;
  averageResponseTime: number;
}

export interface ProxyConfig {
  port: number;
  host: string;
  enableSSL: boolean;
  certPath?: string;
  keyPath?: string;
  captureBody: boolean;
  maxBodySize: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
