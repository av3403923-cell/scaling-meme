import logger from '../utils/logger';
import { HttpRequest } from '../types';

export interface SecurityIssue {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  message: string;
  requestId: string;
}

export class SecurityScanner {
  private sensitivePatterns = [
    /password|pwd|passwd/i,
    /api[_-]?key|apikey/i,
    /auth[_-]?token|token/i,
    /secret|private[_-]?key/i,
    /credit[_-]?card|cc[_-]?number|cvv|ssn/i,
  ];

  private insecurePatterns = [
    { pattern: /^http:\/\//i, type: 'unencrypted-connection' },
    { pattern: /Set-Cookie.*secure/i, type: 'missing-secure-flag', negative: true },
    { pattern: /Set-Cookie.*httponly/i, type: 'missing-httponly-flag', negative: true },
  ];

  scanRequest(request: HttpRequest): SecurityIssue[] {
    const issues: SecurityIssue[] = [];

    // Check for sensitive data in headers
    for (const [key, value] of Object.entries(request.headers)) {
      for (const pattern of this.sensitivePatterns) {
        if (pattern.test(key)) {
          issues.push({
            id: Math.random().toString(36).substr(2, 9),
            severity: 'high',
            type: 'sensitive-data-in-header',
            message: `Sensitive data detected in header: ${key}`,
            requestId: request.id,
          });
        }
      }
    }

    // Check for sensitive data in body
    const bodyStr = request.body?.toString() || '';
    for (const pattern of this.sensitivePatterns) {
      if (pattern.test(bodyStr)) {
        issues.push({
          id: Math.random().toString(36).substr(2, 9),
          severity: 'high',
          type: 'sensitive-data-in-body',
          message: 'Sensitive data detected in request body',
          requestId: request.id,
        });
        break;
      }
    }

    // Check response for security issues
    if (request.responseHeaders) {
      if (!request.responseHeaders['content-security-policy']) {
        issues.push({
          id: Math.random().toString(36).substr(2, 9),
          severity: 'medium',
          type: 'missing-csp-header',
          message: 'Missing Content-Security-Policy header',
          requestId: request.id,
        });
      }

      if (!request.responseHeaders['x-frame-options']) {
        issues.push({
          id: Math.random().toString(36).substr(2, 9),
          severity: 'medium',
          type: 'missing-x-frame-options',
          message: 'Missing X-Frame-Options header',
          requestId: request.id,
        });
      }
    }

    return issues;
  }
}

export const securityScanner = new SecurityScanner();