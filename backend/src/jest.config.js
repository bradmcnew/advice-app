/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  collectCoverage: false,
  coverageProvider: "v8",
  setupFiles: ["backend/testSetup.js"],
  setupFilesAfterEnv: ["<rootDir>/testSetup.js"],
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
  verbose: true,
  forceExit: true,
};

export default config;
