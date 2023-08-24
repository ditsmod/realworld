import type { Config } from 'jest';

// This config is used `ts-jest` to work with TypeScript tests.
const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  projects: [ '<rootDir>/packages/*/jest.config.ts']
};

export default config;
