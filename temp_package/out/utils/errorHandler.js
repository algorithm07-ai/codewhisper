"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const Logger_1 = require("../core/Logger"); // Assuming logger is exported from Logger.ts
/**
 * Handles WhisperError instances, providing a centralized place for error logging and processing.
 * @param error The WhisperError instance to handle.
 * @param additionalContext Optional context to include in logs.
 */
function handleError(error, additionalContext) {
    const contextMessage = additionalContext ? `Context: ${additionalContext} | ` : '';
    Logger_1.logger.error(`${contextMessage}WhisperError Encountered: ${error.message}`, {
        code: error.code,
        details: error.details,
        stack: error.stack
    });
    // TODO: Implement more sophisticated error reporting or user notification logic
    // For example, displaying a VS Code notification to the user
    // vscode.window.showErrorMessage(`Error (${error.code}): ${error.message}`);
}
exports.handleError = handleError;
//# sourceMappingURL=errorHandler.js.map