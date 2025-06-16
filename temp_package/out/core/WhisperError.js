"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhisperError = void 0;
// src/core/WhisperError.ts
class WhisperError extends Error {
    constructor(message, code, details) {
        super(message);
        this.code = code;
        this.details = details;
        this.name = 'WhisperError'; // Optional: for better error identification
    }
}
exports.WhisperError = WhisperError;
//# sourceMappingURL=WhisperError.js.map