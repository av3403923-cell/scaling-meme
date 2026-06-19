import { HttpRequest } from '../types';

export class Helpers {
  static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  static formatDuration(ms: number): string {
    if (ms < 1000) return ms + 'ms';
    if (ms < 60000) return (ms / 1000).toFixed(2) + 's';
    return (ms / 60000).toFixed(2) + 'm';
  }

  static getStatusColor(statusCode?: number): string {
    if (!statusCode) return 'gray';
    if (statusCode < 300) return 'green';
    if (statusCode < 400) return 'blue';
    if (statusCode < 500) return 'yellow';
    return 'red';
  }

  static getMimeType(headers: Record<string, any>): string {
    const contentType = headers['content-type'];
    if (Array.isArray(contentType)) {
      return contentType[0].split(';')[0];
    }
    return (contentType as string)?.split(';')[0] || 'application/octet-stream';
  }

  static parseJson(str: string): any {
    try {
      return JSON.parse(str);
    } catch {
      return null;
    }
  }
}