import logger from '../utils/logger';
import { HttpRequest } from '../types';

export interface ComparisonResult {
  requestId1: string;
  requestId2: string;
  differences: {
    headers: string[];
    body: boolean;
    statusCode: boolean;
    duration: number;
  };
  similarity: number; // 0-100
}

export class ComparisonService {
  compareRequests(req1: HttpRequest, req2: HttpRequest): ComparisonResult {
    const headerDifferences = this.compareHeaders(req1.headers, req2.responseHeaders || {});
    const bodyDifference = req1.body !== req2.responseBody;
    const statusDifference = req1.statusCode !== req2.statusCode;
    const durationDiff = Math.abs((req1.duration || 0) - (req2.duration || 0));

    let similarities = 0;
    if (!bodyDifference) similarities++;
    if (!statusDifference) similarities++;
    if (headerDifferences.length === 0) similarities++;
    if (durationDiff < 100) similarities++;

    const similarity = (similarities / 4) * 100;

    return {
      requestId1: req1.id,
      requestId2: req2.id,
      differences: {
        headers: headerDifferences,
        body: bodyDifference,
        statusCode: statusDifference,
        duration: durationDiff,
      },
      similarity: Math.round(similarity),
    };
  }

  private compareHeaders(
    headers1: Record<string, any>,
    headers2: Record<string, any>
  ): string[] {
    const differences: string[] = [];
    const allKeys = new Set([...Object.keys(headers1), ...Object.keys(headers2)]);

    for (const key of allKeys) {
      const val1 = headers1[key];
      const val2 = headers2[key];
      if (val1 !== val2) {
        differences.push(`${key}: ${val1} vs ${val2}`);
      }
    }

    return differences;
  }
}

export const comparisonService = new ComparisonService();