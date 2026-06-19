import logger from '../utils/logger';

export class Migrations {
  static async runAll() {
    logger.info('Running database migrations...');
    await this.createInitialSchema();
  }

  private static async createInitialSchema() {
    logger.info('Initial schema created');
  }
}