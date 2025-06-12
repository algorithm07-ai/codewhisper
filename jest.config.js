// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'], // Specifies the root directory for Jest to scan for tests
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ], // Patterns Jest uses to detect test files
  transform: {
    '^.+\.(ts|tsx)$': 'ts-jest',
  }, // Tells Jest to use ts-jest for .ts and .tsx files
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'], // An array of file extensions your modules use
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: -10, // Example: allow 10 uncovered statements globally
    },
  },
  collectCoverage: true, // Enables coverage collection
  coverageDirectory: 'coverage', // Directory where Jest should output its coverage files
  coverageReporters: ['json', 'lcov', 'text', 'clover'], // Specifies coverage reporters
  verbose: true, // Indicates whether each individual test should be reported during the run
};
