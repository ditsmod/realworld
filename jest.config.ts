import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'node',
  projects: [ '<rootDir>/packages/*/jest.config.ts']
};

export default config;