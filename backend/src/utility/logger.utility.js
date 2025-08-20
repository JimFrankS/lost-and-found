import { createLogger, format, transports, addColors } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';

const env = process.env.NODE_ENV || 'development';

// Use absolute path and synchronously ensure the 'logs' directory exists BEFORE logger is created
const logDir = path.resolve('logs');
let canUseFileTransport = true;
try {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
} catch (e) {
  canUseFileTransport = false;
  // Using console.warn because the logger is not yet configured.
  console.warn('Could not create log directory. File logging will be disabled.', e);
}

/**
 * Custom log levels and colors for clarity in console
 */
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    verbose: 'cyan',
    debug: 'blue',
    silly: 'grey',
  }
};

// Register custom colors for Winston transports (makes colorize({ all: true }) work with custom levels)
addColors(customLevels.colors);

/**
 * Assemble transports for logger: rotating files and conditional console output
 */
const loggerTransports = [];

if (canUseFileTransport) {
  loggerTransports.push(
    new DailyRotateFile({
      filename: path.join(logDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
    new DailyRotateFile({
      filename: path.join(logDir, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    })
  );
}

// Only log to console in non-production environments, using custom level colors
if (env !== 'production') {
  loggerTransports.unshift(
    new transports.Console({
      format: format.combine(
        format.colorize({ all: true }),
        format.timestamp(),
        format.printf(({ timestamp, level, message, ...meta }) => {
          // Optionally add requestId or user context here if available
          return `[${timestamp}] ${level}: ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta) : ''
          }`;
        })
      ),
    })
  );
}

const logger = createLogger({
  levels: customLevels.levels,
  level: env === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: loggerTransports,
  exitOnError: false, // Do not exit on handled exceptions
});

// Handle uncaught exceptions and unhandled promise rejections with rotating files
if (canUseFileTransport) {
  logger.exceptions.handle(
    new DailyRotateFile({
      filename: path.join(logDir, 'exceptions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
    })
  );

  logger.rejections.handle(
    new DailyRotateFile({
      filename: path.join(logDir, 'rejections-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
    })
  );
}

// Export a 'stream' object compatible with morgan HTTP logger middleware
export const loggerStream = {
  write: (message) => logger.http(message.trim())
};

/**
 * Example usage:
 * import logger, { loggerStream } from './utility/logger.utility.js';
 * logger.info('App started');
 * logger.error('Something went wrong', { error });
 * // For morgan: app.use(morgan('combined', { stream: loggerStream }));
 */

export default logger;