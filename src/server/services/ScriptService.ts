import logger from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

export interface Script {
  id: string;
  name: string;
  enabled: boolean;
  code: string;
  type: 'request-modifier' | 'response-modifier' | 'filter';
  userId: string;
  createdAt: Date;
}

export class ScriptService {
  private scripts: Map<string, Script> = new Map();
  private compiledScripts: Map<string, Function> = new Map();

  addScript(userId: string, script: Omit<Script, 'id' | 'userId' | 'createdAt'>): Script {
    const id = uuidv4();
    const newScript: Script = {
      ...script,
      id,
      userId,
      createdAt: new Date(),
    };
    this.scripts.set(id, newScript);
    this.compileScript(id, script.code);
    logger.info(`Script added: ${id}`);
    return newScript;
  }

  private compileScript(id: string, code: string) {
    try {
      const fn = new Function('request', 'response', 'console', code);
      this.compiledScripts.set(id, fn);
    } catch (error) {
      logger.error(`Failed to compile script ${id}:`, error);
    }
  }

  getScripts(userId: string): Script[] {
    return Array.from(this.scripts.values()).filter(s => s.userId === userId);
  }

  getScript(id: string, userId: string): Script | null {
    const script = this.scripts.get(id);
    return script && script.userId === userId ? script : null;
  }

  updateScript(id: string, userId: string, updates: Partial<Script>): Script | null {
    const script = this.scripts.get(id);
    if (script && script.userId === userId) {
      const updated = { ...script, ...updates };
      this.scripts.set(id, updated);
      if (updates.code) {
        this.compileScript(id, updates.code);
      }
      logger.info(`Script updated: ${id}`);
      return updated;
    }
    return null;
  }

  deleteScript(id: string, userId: string): boolean {
    const script = this.scripts.get(id);
    if (script && script.userId === userId) {
      this.scripts.delete(id);
      this.compiledScripts.delete(id);
      logger.info(`Script deleted: ${id}`);
      return true;
    }
    return false;
  }

  executeScript(id: string, userId: string, context: any): any {
    const script = this.getScript(id, userId);
    if (!script || !script.enabled) return null;

    const fn = this.compiledScripts.get(id);
    if (!fn) return null;

    try {
      return fn(context.request, context.response, console);
    } catch (error) {
      logger.error(`Script execution error: ${id}`, error);
      return null;
    }
  }
}

export const scriptService = new ScriptService();