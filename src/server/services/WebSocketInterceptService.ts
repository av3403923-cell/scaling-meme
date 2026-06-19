import logger from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

export interface WebSocketMessage {
  id: string;
  connectionId: string;
  direction: 'sent' | 'received';
  data: string;
  timestamp: Date;
  type: 'text' | 'binary';
}

export interface WebSocketConnection {
  id: string;
  url: string;
  protocol?: string;
  messages: WebSocketMessage[];
  status: 'connected' | 'disconnected';
  timestamp: Date;
  userId: string;
}

export class WebSocketInterceptService {
  private connections: Map<string, WebSocketConnection> = new Map();

  createConnection(userId: string, url: string, protocol?: string): WebSocketConnection {
    const id = uuidv4();
    const connection: WebSocketConnection = {
      id,
      url,
      protocol,
      messages: [],
      status: 'connected',
      timestamp: new Date(),
      userId,
    };
    this.connections.set(id, connection);
    logger.info(`WebSocket connection created: ${id} - ${url}`);
    return connection;
  }

  addMessage(connectionId: string, data: string, direction: 'sent' | 'received', type: 'text' | 'binary' = 'text'): WebSocketMessage {
    const connection = this.connections.get(connectionId);
    if (!connection) throw new Error('Connection not found');

    const message: WebSocketMessage = {
      id: uuidv4(),
      connectionId,
      direction,
      data,
      timestamp: new Date(),
      type,
    };
    connection.messages.push(message);
    return message;
  }

  getConnection(id: string, userId: string): WebSocketConnection | null {
    const conn = this.connections.get(id);
    return conn && conn.userId === userId ? conn : null;
  }

  getConnections(userId: string): WebSocketConnection[] {
    return Array.from(this.connections.values()).filter(c => c.userId === userId);
  }

  closeConnection(id: string, userId: string): boolean {
    const conn = this.connections.get(id);
    if (conn && conn.userId === userId) {
      conn.status = 'disconnected';
      logger.info(`WebSocket connection closed: ${id}`);
      return true;
    }
    return false;
  }

  deleteConnection(id: string, userId: string): boolean {
    const conn = this.connections.get(id);
    if (conn && conn.userId === userId) {
      this.connections.delete(id);
      logger.info(`WebSocket connection deleted: ${id}`);
      return true;
    }
    return false;
  }
}

export const webSocketInterceptService = new WebSocketInterceptService();