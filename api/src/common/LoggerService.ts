import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as winston from 'winston';

export class LoggerService extends Logger {
  private logger;

  constructor() {
    super();

    // Create logs dir if it doesn't exist
    const dirPath = 'logs';
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }

    const options = {
      file: {
        level: 'info',
        filename: './logs/combined.log',
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 10,
        colorize: false,
        format: winston.format(this.formatJSON)(),
      },
      console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
        timestamp: true,
      },
    };

    this.logger = winston.createLogger({
      transports: [new winston.transports.File(options.file), new winston.transports.Console(options.console)],
      exitOnError: false, // do not exit on handled exceptions
    });
  }

  /**
   * Adds a datetime string to the log msg object and converts it to json.
   * @param logEntry
   */
  private formatJSON = (logEntry: any) => {
    const msg = Symbol.for('message');
    const base = { timestamp: this.getTimeString() };
    const json = Object.assign(base, logEntry);

    logEntry[msg] = JSON.stringify(json);
    return logEntry;
  };

  private getTimeString(): string {
    return new Date().toLocaleString('hr', {
      timeZone: 'Europe/Vienna',
    });
  }

  log(message: string): void {
    this.logger.log('info', message);
  }

  error(message: string, trace: string): void {
    this.logger.log('error', message, trace);
  }

  warn(message: string): void {
    this.logger.warn(message);
  }

  debug(message: string): void {
    this.logger.debug(message);
  }
}
