import * as zlib from 'zlib';
import { promisify } from 'util';
import logger from '../utils/logger';

const gunzip = promisify(zlib.gunzip);
const brotliDecompress = promisify(zlib.brotliDecompress);
const gzip = promisify(zlib.gzip);
const brotliCompress = promisify(zlib.brotliCompress);
const deflate = promisify(zlib.deflate);
const inflate = promisify(zlib.inflate);

export class CompressionService {
  static async decompressBody(body: Buffer, encoding: string): Promise<string> {
    try {
      let decompressed: Buffer;

      switch (encoding?.toLowerCase()) {
        case 'gzip':
          decompressed = await gunzip(body);
          break;
        case 'br':
          decompressed = await brotliDecompress(body);
          break;
        case 'deflate':
          decompressed = await inflate(body);
          break;
        default:
          return body.toString('utf8');
      }

      return decompressed.toString('utf8');
    } catch (error) {
      logger.warn(`Failed to decompress body with encoding ${encoding}`);
      return body.toString('utf8');
    }
  }

  static async compressBody(body: string, encoding: string): Promise<Buffer> {
    try {
      switch (encoding?.toLowerCase()) {
        case 'gzip':
          return await gzip(body);
        case 'br':
          return await brotliCompress(body);
        case 'deflate':
          return await deflate(body);
        default:
          return Buffer.from(body);
      }
    } catch (error) {
      logger.warn(`Failed to compress body with encoding ${encoding}`);
      return Buffer.from(body);
    }
  }

  static getContentEncoding(headers: Record<string, any>): string | null {
    const contentEncoding = headers['content-encoding'];
    if (Array.isArray(contentEncoding)) {
      return contentEncoding[0];
    }
    return contentEncoding || null;
  }
}