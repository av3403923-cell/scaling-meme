import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';
import logger from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';
import authRoutes from './routes/auth';
import requestRoutes from './routes/requests';
import analyticsRoutes from './routes/analytics';
import configRoutes from './routes/config';
import { ProxyServer } from './proxy/proxyServer';

dotenv.config();

const app: Express = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.WEB_URL || 'http://localhost:5173',
    credentials: true,
  },
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/requests', authMiddleware, requestRoutes);
app.use('/api/analytics', authMiddleware, analyticsRoutes);
app.use('/api/config', authMiddleware, configRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// Socket.IO events
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Proxy server instance
let proxyServer: ProxyServer;

const PORT = process.env.PORT || 3000;
const PROXY_PORT = process.env.PROXY_PORT || 8080;

httpServer.listen(PORT, () => {
  logger.info(`✅ Server running on port ${PORT}`);
  logger.info(`🌐 API URL: http://localhost:${PORT}/api`);
  logger.info(`🎨 Web URL: ${process.env.WEB_URL || 'http://localhost:5173'}`);
});

// Initialize proxy server
proxyServer = new ProxyServer(PROXY_PORT as number, io);
proxyServer.start();

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    logger.info('HTTP server closed');
    proxyServer.stop();
    process.exit(0);
  });
});

export { app, httpServer, io };
