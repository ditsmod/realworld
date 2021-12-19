module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/packages/.+/dist/'],
  projects: [ '<rootDir>/packages/*/jest.config.ts']
};
