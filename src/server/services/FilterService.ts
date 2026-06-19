import { HttpRequest } from '../types';

export interface FilterOptions {
  domain?: string;
  method?: string;
  statusCode?: number;
  statusCodeRange?: { min: number; max: number };
  search?: string;
  mimeType?: string;
  hasResponse?: boolean;
  dateRange?: { start: Date; end: Date };
  size?: { min: number; max: number };
}

export class FilterService {
  static filter(requests: HttpRequest[], options: FilterOptions): HttpRequest[] {
    return requests.filter(req => {
      if (options.domain && req.domain !== options.domain) return false;
      if (options.method && req.method !== options.method) return false;
      if (options.statusCode && req.statusCode !== options.statusCode) return false;

      if (options.statusCodeRange && req.statusCode) {
        if (req.statusCode < options.statusCodeRange.min || req.statusCode > options.statusCodeRange.max) {
          return false;
        }
      
      if (options.search) {
        const searchLower = options.search.toLowerCase();
        const urlMatch = req.url.toLowerCase().includes(searchLower);
        const bodyMatch = req.responseBody?.toString().toLowerCase().includes(searchLower);
        if (!urlMatch && !bodyMatch) return false;
      }

      if (options.mimeType) {
        const contentType = req.responseHeaders?.['content-type'];
        if (!contentType?.toString().includes(options.mimeType)) return false;
      }

      if (options.hasResponse && !req.statusCode) return false;

      if (options.dateRange) {
        if (req.timestamp < options.dateRange.start || req.timestamp > options.dateRange.end) {
          return false;
        }
      }

      if (options.size && req.size) {
        if (req.size < options.size.min || req.size > options.size.max) {
          return false;
        }
      }

      return true;
    });
  }

  static search(requests: HttpRequest[], query: string): HttpRequest[] {
    const queryLower = query.toLowerCase();
    return requests.filter(req => {
      return (
        req.url.toLowerCase().includes(queryLower) ||
        req.domain?.toLowerCase().includes(queryLower) ||
        req.responseBody?.toString().toLowerCase().includes(queryLower)
      );
    });
  }
}