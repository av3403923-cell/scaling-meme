import logger from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

export interface GraphQLQuery {
  id: string;
  operation: string;
  query: string;
  variables?: Record<string, any>;
  response?: string;
  timestamp: Date;
  duration?: number;
  userId: string;
}

export class GraphQLService {
  private queries: Map<string, GraphQLQuery> = new Map();

  isGraphQLRequest(url: string, body: string, contentType: string): boolean {
    if (!contentType.includes('application/json')) return false;
    try {
      const parsed = JSON.parse(body);
      return parsed.query !== undefined || parsed.operationName !== undefined;
    } catch {
      return false;
    }
  }

  parseGraphQLQuery(body: string): { operation: string; query: string; variables?: Record<string, any> } | null {
    try {
      const parsed = JSON.parse(body);
      return {
        operation: parsed.operationName || 'anonymous',
        query: parsed.query,
        variables: parsed.variables,
      };
    } catch {
      return null;
    }
  }

  logQuery(userId: string, parsed: any, response: string, duration: number): GraphQLQuery {
    const id = uuidv4();
    const query: GraphQLQuery = {
      id,
      operation: parsed.operation,
      query: parsed.query,
      variables: parsed.variables,
      response,
      timestamp: new Date(),
      duration,
      userId,
    };
    this.queries.set(id, query);
    logger.info(`GraphQL query logged: ${parsed.operation}`);
    return query;
  }

  getQueries(userId: string): GraphQLQuery[] {
    return Array.from(this.queries.values()).filter(q => q.userId === userId);
  }

  getQuery(id: string, userId: string): GraphQLQuery | null {
    const query = this.queries.get(id);
    return query && query.userId === userId ? query : null;
  }

  deleteQuery(id: string, userId: string): boolean {
    const query = this.queries.get(id);
    if (query && query.userId === userId) {
      this.queries.delete(id);
      logger.info(`GraphQL query deleted: ${id}`);
      return true;
    }
    return false;
  }
}

export const graphQLService = new GraphQLService();