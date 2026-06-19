import * as http from 'http';
import * as https from 'https';
import httpProxy from 'http-proxy';
import { Server as SocketIOServer } from 'socket.io';
import { database } from '../database/db';
import logger from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

export class ProxyServer {
  private server: http.Server | null = null;
  private proxy: httpProxy.ProxyServer;
  private port: number;
  private io: SocketIOServer;

  constructor(port: number, io: SocketIOServer) {
    this.port = port;
    this.io = io;
    this.proxy = httpProxy.createProxyServer({
      changeOrigin: true,
      preserveHeaderKeyCase: true,
    });

    this.setupProxyHandlers();
  }

  private setupProxyHandlers() {
    this.proxy.on('proxyReq', (proxyReq, req: any, res, options) => {
      // Capture request
      req.requestId = uuidv4();
      req.startTime = Date.now();

      let bodyData = '';
      req.on('data', (chunk: Buffer) => {
        bodyData += chunk.toString('utf8');
      });

      req.on('end', () => {
        req.body = bodyData;
      });
    });

    this.proxy.on('proxyRes', (proxyRes: any, req: any, res) => {
      const duration = Date.now() - req.startTime;
      let responseBody = '';

      proxyRes.on('data', (chunk: Buffer) => {
        responseBody += chunk.toString('utf8');
      });

      proxyRes.on('end', () => {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const httpRequest = database.saveRequest({
          method: req.method,
          url: req.url,
          headers: req.headers,
          body: req.body,
          statusCode: proxyRes.statusCode,
          responseHeaders: proxyRes.headers,
          responseBody,
          duration,
          size: Buffer.byteLength(responseBody),
          domain: url.hostname,
          path: url.pathname,
          query: url.search,
          timestamp: new Date(),
          userId: 'default-user', // Should be set from auth
        });

        // Emit via WebSocket
        this.io.emit('request:new', httpRequest);
        logger.info(`Intercepted: ${req.method} ${req.url}`);
      });
    });

    this.proxy.on('error', (err, req, res) => {
      logger.error('Proxy error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Proxy error' }));
    });
  }

  public start() {
    this.server = http.createServer((req, res) => {
      if (!req.url) {
        res.writeHead(400);
        res.end();
        return;
      }

      const target = this.getTargetUrl(req);
      if (!target) {
        res.writeHead(400);
        res.end('Invalid target');
        return;
      }

      this.proxy.web(req, res, { target });
    });

    this.server.listen(this.port, () => {
      logger.info(`🔌 Proxy server running on port ${this.port}`);
    });
  }

  public stop() {
    if (this.server) {
      this.server.close();
      logger.info('Proxy server stopped');
    }
  }

  private getTargetUrl(req: http.IncomingMessage): string | null {
    const url = req.url;
    if (!url) return null;

    // Parse URL and extract target
    if (url.startsWith('http')) {
      return url;
    }

    // Infer from headers
    const host = req.headers.host;
    return `http://${host}${url}`;
  }
}
