// src/core/Logger.ts
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export class Logger {
  private static instance: Logger;
  private minLevel: LogLevel = LogLevel.INFO; // Default log level, can be configured

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public setLogLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  public getLogLevel(): LogLevel {
    return this.minLevel;
  }

  private formatMessage(level: LogLevel, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const levelStr = LogLevel[level];
    let logMessage = `${timestamp} [${levelStr}] - ${message}`;
    if (meta) {
      try {
        // Handle potential circular structures in meta for robust stringification
        const cache = new Set();
        const metaString = JSON.stringify(meta, (key, value) => {
          if (typeof value === 'object' && value !== null) {
            if (cache.has(value)) {
              // Circular reference found, discard key
              return '[Circular]';
            }
            // Store value in our collection
            cache.add(value);
          }
          return value;
        }, 2);
        logMessage += ` | Meta: ${metaString}`;
      } catch (e) {
        logMessage += ` | Meta: (Error serializing metadata: ${(e as Error).message})`;
      }
    }
    return logMessage;
  }

  public log(level: LogLevel, message: string, meta?: any): void {
    if (level >= this.minLevel) {
      const formattedMessage = this.formatMessage(level, message, meta);
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(formattedMessage);
          break;
        case LogLevel.INFO:
          console.info(formattedMessage);
          break;
        case LogLevel.WARN:
          console.warn(formattedMessage);
          break;
        case LogLevel.ERROR:
          console.error(formattedMessage);
          break;
        default:
          console.log(formattedMessage); // Fallback for unknown levels
      }
      // TODO: Integrate with VS Code OutputChannel for better visibility in the extension
      // Example: if (this.outputChannel) this.outputChannel.appendLine(formattedMessage);
    }
  }

  public debug(message: string, meta?: any): void {
    this.log(LogLevel.DEBUG, message, meta);
  }

  public info(message: string, meta?: any): void {
    this.log(LogLevel.INFO, message, meta);
  }

  public warn(message: string, meta?: any): void {
    this.log(LogLevel.WARN, message, meta);
  }

  public error(message: string, meta?: any): void {
    this.log(LogLevel.ERROR, message, meta);
  }
}

// Export a singleton instance for easy use throughout the application
export const logger = Logger.getInstance();
