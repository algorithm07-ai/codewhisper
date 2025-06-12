// src/core/WhisperError.ts
export class WhisperError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'WhisperError'; // Optional: for better error identification
  }
}
