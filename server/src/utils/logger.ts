import winston from 'winston';
import { NodeEnv } from '../../../shared/types/environment.types';
const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// Custom log format for console output
const consoleLogFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  
  // Add stack trace if error
  if (stack) {
    msg += `\n${stack}`;
  }
  
  // Add metadata if present
  if (Object.keys(metadata).length > 0) {
    msg += `\n${JSON.stringify(metadata, null, 2)}`;
  }
  
  return msg;
});

// Custom log format for file output (JSON)
const fileLogFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  json()
);

// Console format (colorized for development)
const consoleFormat = combine(
  colorize(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  consoleLogFormat
);

// Determine log level based on environment
const getLogLevel = (): string => {
  const env = process.env.NODE_ENV as NodeEnv;
  
  switch (env) {
    case NodeEnv.PRODUCTION:
      return 'info';
    case NodeEnv.TEST:
      return 'warn';
    case NodeEnv.DEVELOPMENT:
    default:
      return 'debug';
  }
};

// Create Winston logger instance
const logger = winston.createLogger({
  level: getLogLevel(),
  format: fileLogFormat,
  defaultMeta: { 
    service: 'year-in-code-server',
    environment: process.env.NODE_ENV || NodeEnv.DEVELOPMENT 
  },
  transports: [
    // Console transport (always enabled)
    new winston.transports.Console({
      format: consoleFormat,
    }),
    
    // File transport - All logs
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    
    // File transport - Error logs only
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
  
  // Handle exceptions and rejections
  exceptionHandlers: [
    new winston.transports.File({ 
      filename: 'logs/exceptions.log',
      maxsize: 5242880,
      maxFiles: 3,
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ 
      filename: 'logs/rejections.log',
      maxsize: 5242880,
      maxFiles: 3,
    }),
  ],
});

// Disable file logging in test environment
if (process.env.NODE_ENV === NodeEnv.TEST) {
  logger.clear();
  logger.add(new winston.transports.Console({
    format: consoleFormat,
    silent: true, // Silent in tests unless explicitly needed
  }));
}

// Create a stream for Morgan HTTP request logging
export const morganStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// Helper methods for common logging patterns
export const loggers = {
  // Database operations
  db: {
    connected: (uri: string) => logger.info('📊 Database connected', { uri: uri.replace(/\/\/.*@/, '//***@') }),
    disconnected: () => logger.warn('📊 Database disconnected'),
    error: (error: Error) => logger.error('📊 Database error', { error: error.message, stack: error.stack }),
  },
  
  // Server operations
  server: {
    started: (port: number, env: string) => logger.info(`🚀 Server started on port ${port} in ${env} mode`),
    stopped: () => logger.info('🛑 Server stopped'),
    error: (error: Error) => logger.error('🛑 Server error', { error: error.message, stack: error.stack }),
  },
  
  // Request operations
  request: {
    received: (method: string, url: string, ip?: string) => 
      logger.http('📥 Request received', { method, url, ip }),
    completed: (method: string, url: string, statusCode: number, duration: number) =>
      logger.http('📤 Request completed', { method, url, statusCode, duration: `${duration}ms` }),
    error: (method: string, url: string, error: Error) =>
      logger.error('❌ Request error', { method, url, error: error.message, stack: error.stack }),
  },
  
  // Authentication operations
  auth: {
    login: (userId: string) => logger.info('🔐 User logged in', { userId }),
    logout: (userId: string) => logger.info('🔓 User logged out', { userId }),
    failed: (reason: string, ip?: string) => logger.warn('🔐 Authentication failed', { reason, ip }),
    registered: (userId: string) => logger.info('✅ User registered', { userId }),
  },
  
  // General application logs
  app: {
    info: (message: string, meta?: object) => logger.info(message, meta),
    warn: (message: string, meta?: object) => logger.warn(message, meta),
    error: (message: string, error?: Error) => 
      logger.error(message, { error: error?.message, stack: error?.stack }),
    debug: (message: string, meta?: object) => logger.debug(message, meta),
  },
};

// Export the logger instance
export default logger;
