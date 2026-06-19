import { HttpRequest } from '../types';
import * as fs from 'fs';
import * as path from 'path';
import logger from '../utils/logger';

export class ExportService {
  static toJSON(requests: HttpRequest[]): string {
    return JSON.stringify(requests, null, 2);
  }

  static toCSV(requests: HttpRequest[]): string {
    const headers = ['ID', 'Method', 'URL', 'Status', 'Duration', 'Size', 'Timestamp'];
    const rows = requests.map(req => [
      req.id,
      req.method,
      req.url,
      req.statusCode || '-',
      req.duration || '-',
      req.size || '-',
      req.timestamp.toISOString(),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    return csv;
  }

  static toHAR(requests: HttpRequest[]): any {
    return {
      log: {
        version: '1.2.0',
        creator: {
          name: 'HTTP Toolkit for Termux',
          version: '1.0.0',
        },
        entries: requests.map(req => ({
          startedDateTime: req.timestamp.toISOString(),
          time: req.duration || 0,
          request: {
            method: req.method,
            url: req.url,
            httpVersion: 'HTTP/1.1',
            headers: Object.entries(req.headers || {}).map(([name, value]) => ({
              name,
              value: Array.isArray(value) ? value.join(', ') : value,
            })),
            queryString: [],
            cookies: [],
            headersSize: 0,
            bodySize: Buffer.byteLength(req.body?.toString() || ''),
          },
          response: {
            status: req.statusCode || 0,
            statusText: this.getStatusText(req.statusCode),
            httpVersion: 'HTTP/1.1',
            headers: Object.entries(req.responseHeaders || {}).map(([name, value]) => ({
              name,
              value: Array.isArray(value) ? value.join(', ') : value,
            })),
            cookies: [],
            content: {
              size: req.size || 0,
              mimeType: (req.responseHeaders?.['content-type'] as string) || 'application/octet-stream',
              text: req.responseBody?.toString() || '',
            },
            redirectURL: '',
            headersSize: 0,
            bodySize: req.size || 0,
          },
          cache: {},
          timings: {
            blocked: 0,
            dns: 0,
            connect: 0,
            send: 0,
            wait: req.duration || 0,
            receive: 0,
            ssl: 0,
          },
        })),
      },
    };
  }

  static async saveFile(filename: string, content: string, format: 'json' | 'csv' | 'har'): Promise<string> {
    try {
      const exportsDir = path.join(process.cwd(), 'exports');
      if (!fs.existsSync(exportsDir)) {
        fs.mkdirSync(exportsDir, { recursive: true });
      }

      const filepath = path.join(exportsDir, `${filename}.${format}`);
      fs.writeFileSync(filepath, content);
      logger.info(`File exported: ${filepath}`);
      return filepath;
    } catch (error) {
      logger.error('Export error:', error);
      throw error;
    }
  }

  private static getStatusText(status?: number): string {
    const statusTexts: Record<number, string> = {
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
    return statusTexts[status || 0] || 'Unknown';
  }
}