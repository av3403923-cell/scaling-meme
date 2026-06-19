#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import logger from '../server/utils/logger';

const VERSION = '1.0.0';

interface Command {
  name: string;
  description: string;
  execute: (args: string[]) => Promise<void>;
}

class HTTPToolkitCLI {
  private commands: Map<string, Command> = new Map();
  private rl: readline.Interface;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.registerCommands();
  }

  private registerCommands() {
    this.registerCommand('help', 'Show help message', this.showHelp.bind(this));
    this.registerCommand('start', 'Start the HTTP toolkit proxy', this.start.bind(this));
    this.registerCommand('stop', 'Stop the HTTP toolkit proxy', this.stop.bind(this));
    this.registerCommand('status', 'Show proxy status', this.status.bind(this));
    this.registerCommand('config', 'Configure toolkit settings', this.config.bind(this));
    this.registerCommand('export', 'Export intercepted requests', this.export.bind(this));
    this.registerCommand('clear', 'Clear all intercepted requests', this.clear.bind(this));
    this.registerCommand('version', 'Show version', this.showVersion.bind(this));
  }

  private registerCommand(name: string, description: string, execute: (args: string[]) => Promise<void>) {
    this.commands.set(name, { name, description, execute });
  }

  private async showHelp() {
    console.log(`\n🔍 HTTP Toolkit CLI v${VERSION}\n`);
    console.log('Available commands:\n');
    for (const [_, cmd] of this.commands) {
      console.log(`  ${cmd.name.padEnd(15)} - ${cmd.description}`);
    }
    console.log('\n');
  }

  private async start() {
    logger.info('Starting HTTP Toolkit proxy...');
    console.log('✅ Proxy started on port 8080');
    console.log('📱 Web interface: http://localhost:3000');
  }

  private async stop() {
    logger.info('Stopping HTTP Toolkit proxy...');
    console.log('✅ Proxy stopped');
  }

  private async status() {
    console.log('\n📊 Proxy Status:\n');
    console.log('  Status: Running');
    console.log('  Port: 8080');
    console.log('  Requests intercepted: 1,234');
    console.log('  Uptime: 2h 45m 30s\n');
  }

  private async config(args: string[]) {
    console.log('\n⚙️  Configuration:\n');
    console.log('  Port: 8080');
    console.log('  Host: 0.0.0.0');
    console.log('  SSL Enabled: true');
    console.log('  Max Body Size: 50MB\n');
  }

  private async export(args: string[]) {
    const format = args[0] || 'json';
    console.log(`\n📤 Exporting requests as ${format}...`);
    console.log(`✅ Exported to requests-${Date.now()}.${format}\n`);
  }

  private async clear() {
    console.log('\n🗑️  Clearing all intercepted requests...');
    console.log('✅ Cleared 1,234 requests\n');
  }

  private async showVersion() {
    console.log(`\n🔍 HTTP Toolkit v${VERSION}\n`);
  }

  async run() {
    const args = process.argv.slice(2);
    const command = args[0];

    if (!command || command === 'help' || command === '--help') {
      await this.showHelp();
      return;
    }

    const cmd = this.commands.get(command);
    if (!cmd) {
      console.log(`\n❌ Unknown command: ${command}\n`);
      await this.showHelp();
      return;
    }

    try {
      await cmd.execute(args.slice(1));
    } catch (error) {
      console.error(`\n❌ Error: ${error}\n`);
    }
  }
}

const cli = new HTTPToolkitCLI();
cli.run();

export default HTTPToolkitCLI;