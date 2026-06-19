import { HttpRequest } from '../types';
import { database } from '../database/db';
import logger from '../utils/logger';
import axios from 'axios';

export class RequestService {
  static async replayRequest(requestId: string, userId: string): Promise<HttpRequest | null> {
    try {
      const originalRequest = database.getRequestById(requestId, userId);
      if (!originalRequest) {
        logger.warn(`Request not found: ${requestId}`);
        return null;
      }

      const startTime = Date.now();
      const response = await axios({
        method: originalRequest.method as any,
        url: originalRequest.url,
        headers: originalRequest.headers,
        data: originalRequest.body,
        validateStatus: () => true,
      });

      const duration = Date.now() - startTime;
      const replayedRequest: Omit<HttpRequest, 'id'> = {
        ...originalRequest,
        statusCode: response.status,
        responseHeaders: response.headers as any,
        responseBody: JSON.stringify(response.data),
        duration,
        timestamp: new Date(),
      };

      const result = database.saveRequest(replayedRequest);
      logger.info(`Request replayed: ${originalRequest.method} ${originalRequest.url}`);
      return result;
    } catch (error) {
      logger.error('Error replaying request:', error);
      return null;
    }
  }

  static mockRequest(requestId: string, userId: string, mockResponse: any): HttpRequest | null {
    try {
      const request = database.getRequestById(requestId, userId);
      if (!request) {
        return null;
      }

      // Save mock response
      const mockRequest: Omit<HttpRequest, 'id'> = {
        ...request,
        statusCode: mockResponse.statusCode || 200,
        responseBody: typeof mockResponse.body === 'string' ? mockResponse.body : JSON.stringify(mockResponse.body),
        isMocked: true,
        mockResponse: JSON.stringify(mockResponse),
        timestamp: new Date(),
      };

      const result = database.saveRequest(mockRequest);
      logger.info(`Mock created for: ${request.method} ${request.url}`);
      return result;
    } catch (error) {
      logger.error('Error creating mock:', error);
      return null;
    }
  }

  static filterRequests(
    requests: HttpRequest[],
    filters: { domain?: string; method?: string; statusCode?: number }
  ): HttpRequest[] {
    return requests.filter(req => {
      if (filters.domain && req.domain !== filters.domain) return false;
      if (filters.method && req.method !== filters.method) return false;
      if (filters.statusCode && req.statusCode !== filters.statusCode) return false;
      return true;
    });
  }
}
