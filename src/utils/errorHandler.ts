// src/utils/errorHandler.ts
import { WhisperError } from '../core/WhisperError';
import { logger } from '../core/Logger'; // Assuming logger is exported from Logger.ts

/**
 * Handles WhisperError instances, providing a centralized place for error logging and processing.
 * @param error The WhisperError instance to handle.
 * @param additionalContext Optional context to include in logs.
 */
export function handleError(error: WhisperError, additionalContext?: string): void {
  const contextMessage = additionalContext ? `Context: ${additionalContext} | ` : '';
  logger.error(
    `${contextMessage}WhisperError Encountered: ${error.message}`,
    {
      code: error.code,
      details: error.details,
      stack: error.stack
    }
  );
  // TODO: Implement more sophisticated error reporting or user notification logic
  // For example, displaying a VS Code notification to the user
  // vscode.window.showErrorMessage(`Error (${error.code}): ${error.message}`);
}
