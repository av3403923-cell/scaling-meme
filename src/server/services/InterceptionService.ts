import { HttpRequest } from '../types';
import logger from '../utils/logger';
import { CompressionService } from './CompressionService';
import { v4 as uuidv4 } from 'uuid';

export class InterceptionService {
  private interceptedRequests: Map<string, any> = new Map();
  private paused: Set<string> = new Set();

  async interceptRequest(req: any): Promise<any> {
    const requestId = uuidv4();
    
    let body = '';
    for await (const chunk of req) {
      body += chunk.toString();
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const encoding = CompressionService.getContentEncoding(req.headers);
    const decodedBody = encoding ? await CompressionService.decompressBody(Buffer.from(body), encoding) : body;

    const intercepted = {
      id: requestId,
      method: req.method,
      url: req.url,
      fullUrl: url.toString(),
      headers: req.headers,
      body: decodedBody,
      domain: url.hostname,
      path: url.pathname,
      query: url.search,
      timestamp: new Date(),
      isPaused: false,
    };

    this.interceptedRequests.set(requestId, intercepted);
    logger.info(`Intercepted: ${req.method} ${req.url}`);
    return intercepted;
  }

  async interceptResponse(res: any, requestId: string): Promise<any> {
    let body = '';
    for await (const chunk of res) {
      body += chunk.toString();
    }

    const encoding = CompressionService.getContentEncoding(res.headers);
    const decodedBody = encoding ? await CompressionService.decompressBody(Buffer.from(body), encoding) : body;

    const intercepted = this.interceptedRequests.get(requestId);
    if (intercepted) {
      intercepted.response = {
        statusCode: res.statusCode,
        headers: res.headers,
        body: decodedBody,
      };
    }

    return { statusCode: res.statusCode, headers: res.headers, body: decodedBody };
  }

  pauseRequest(requestId: string): boolean {
    if (this.interceptedRequests.has(requestId)) {
      this.paused.add(requestId);
      this.interceptedRequests.get(requestId).isPaused = true;
      logger.info(`Request paused: ${requestId}`);
      return true;
    }
    return false;
  }

  resumeRequest(requestId: string): boolean {
    if (this.paused.has(requestId)) {
      this.paused.delete(requestId);
      const req = this.interceptedRequests.get(requestId);
      if (req) req.isPaused = false;
      logger.info(`Request resumed: ${requestId}`);
      return true;
    }
    return false;
  }

  modifyRequest(requestId: string, modifications: any): boolean {
    const req = this.interceptedRequests.get(requestId);
    if (req) {
      if (modifications.headers) req.headers = { ...req.headers, ...modifications.headers };
      if (modifications.body) req.body = modifications.body;
      if (modifications.url) req.url = modifications.url;
      logger.info(`Request modified: ${requestId}`);
      return true;
    }
    return false;
  }

  modifyResponse(requestId: string, modifications: any): boolean {
    const req = this.interceptedRequests.get(requestId);
    if (req && req.response) {
      if (modifications.statusCode) req.response.statusCode = modifications.statusCode;
      if (modifications.headers) req.response.headers = { ...req.response.headers, ...modifications.headers };
      if (modifications.body) req.response.body = modifications.body;
      logger.info(`Response modified: ${requestId}`);
      return true;
    }
    return false;
  }

  getInterceptedRequest(requestId: string): any {
    return this.interceptedRequests.get(requestId);
  }

  getAllIntercepted(): any[] {
    return Array.from(this.interceptedRequests.values());
  }

  clearIntercepted() {
    this.interceptedRequests.clear();
    this.paused.clear();
  }
}

export const interceptionService = new InterceptionService();