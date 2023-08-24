import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/src/', '<rootDir>/test/'],
  moduleNameMapper: {
    '@postman-collection': '<rootDir>/test/conduit.postman-collection.json',
    '@src/(.+)': '<rootDir>/dist/app/app.module',
    '@shared': '<rootDir>/../shared/dist/server',
    '@classes/(.+)': '<rootDir>/dist/app/classes/$1',
    '@models/(.+)': '<rootDir>/dist/app/models/$1',
    '@service/(.+)': '<rootDir>/dist/app/modules/service/$1',
    '@routed/(.+)': '<rootDir>/dist/app/modules/routed/$1',
    '@configs/(.+)': '<rootDir>/dist/app/configs/$1',
    '@services-per-app/(.+)': '<rootDir>/dist/app/services-per-app/$1',
    '@utils/(.+)': '<rootDir>/dist/app/utils/$1',
    '@params': '<rootDir>/dist/app/models/params',
  },
};

export default config;
