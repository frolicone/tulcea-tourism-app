/**
 * Logging utility that prevents sensitive information from leaking in production
 * Following OWASP Mobile Security best practices
 */

// Check if running in development mode
const isDevelopment =
  typeof __DEV__ !== 'undefined' ? __DEV__ : process.env['NODE_ENV'] === 'development';

/**
 * Logger interface for type-safe logging
 */
interface Logger {
  error: (message: string, error?: any) => void;
  warn: (message: string, data?: any) => void;
  info: (message: string, data?: any) => void;
  debug: (message: string, data?: any) => void;
}

/**
 * Centralized logger that only logs in development mode
 * In production, errors should be sent to a monitoring service (e.g., Sentry)
 */
export const logger: Logger = {
  /**
   * Log error messages
   * @param message - Error message
   * @param error - Optional error object or additional data
   */
  error: (message: string, error?: any) => {
    if (isDevelopment) {
      console.error(`[ERROR] ${message}`, error);
    } else {
      // TODO: Send to error monitoring service (Sentry, Bugsnag, etc.)
      // Example: Sentry.captureException(error, { tags: { message } });
    }
  },

  /**
   * Log warning messages
   * @param message - Warning message
   * @param data - Optional additional data
   */
  warn: (message: string, data?: any) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, data);
    }
  },

  /**
   * Log info messages
   * @param message - Info message
   * @param data - Optional additional data
   */
  info: (message: string, data?: any) => {
    if (isDevelopment) {
      console.log(`[INFO] ${message}`, data);
    }
  },

  /**
   * Log debug messages (only in development)
   * @param message - Debug message
   * @param data - Optional additional data
   */
  debug: (message: string, data?: any) => {
    if (isDevelopment) {
      console.log(`[DEBUG] ${message}`, data);
    }
  },
};

/**
 * Helper to safely stringify errors for logging
 * @param error - Error object
 * @returns String representation of error
 */
export const stringifyError = (error: any): string => {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}${error.stack ? '\n' + error.stack : ''}`;
  }

  if (typeof error === 'object' && error !== null) {
    try {
      return JSON.stringify(error, null, 2);
    } catch {
      return String(error);
    }
  }

  return String(error);
};

/**
 * Log API errors with consistent format
 * @param operation - API operation name (e.g., 'fetchCategories')
 * @param error - Error object
 */
export const logApiError = (operation: string, error: any) => {
  logger.error(`API Error in ${operation}:`, {
    operation,
    error: stringifyError(error),
    timestamp: new Date().toISOString(),
  });
};

export default logger;
