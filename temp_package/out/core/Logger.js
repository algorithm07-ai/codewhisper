"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.Logger = exports.LogLevel = void 0;
// src/core/Logger.ts
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
class Logger {
    constructor() {
        this.minLevel = LogLevel.INFO; // Default log level, can be configured
    }
    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }
    setLogLevel(level) {
        this.minLevel = level;
    }
    getLogLevel() {
        return this.minLevel;
    }
    formatMessage(level, message, meta) {
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
            }
            catch (e) {
                logMessage += ` | Meta: (Error serializing metadata: ${e.message})`;
            }
        }
        return logMessage;
    }
    log(level, message, meta) {
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
    debug(message, meta) {
        this.log(LogLevel.DEBUG, message, meta);
    }
    info(message, meta) {
        this.log(LogLevel.INFO, message, meta);
    }
    warn(message, meta) {
        this.log(LogLevel.WARN, message, meta);
    }
    error(message, meta) {
        this.log(LogLevel.ERROR, message, meta);
    }
}
exports.Logger = Logger;
// Export a singleton instance for easy use throughout the application
exports.logger = Logger.getInstance();
//# sourceMappingURL=Logger.js.map