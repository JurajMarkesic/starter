import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as winston from 'winston';

export class LoggerService extends Logger {
  private logger;

  constructor() {
    super();

    const dirPath = 'logs';
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }

    function timezone() {
      return new Date().toLocaleString('hr', {
        timeZone: 'Europe/Vienna',
      });
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
        format: winston.format.combine(
          winston.format.timestamp({ format: timezone() }),
          // winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
          winston.format.json(),
        ),
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

  log(message: string) {
    this.logger.log('info', message);

    if (process.env.NODE_ENV == 'DEV') {
      super.log(message);
    }
  }
  error(message: string, trace: string) {
    this.logger.log('error', message, trace);

    if (process.env.NODE_ENV == 'DEV') {
      super.error(message, trace);
    }
  }
  warn(message: string) {
    this.logger.warn(message);

    if (process.env.NODE_ENV == 'DEV') {
      super.warn(message);
    }
  }
  debug(message: string) {
    this.logger.debug(message);

    if (process.env.NODE_ENV == 'DEV') {
      super.debug(message);
    }
  }
}
