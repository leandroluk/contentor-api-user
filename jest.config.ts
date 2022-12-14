import { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  roots: ['<rootDir>/src', '<rootDir>/mocks', '<rootDir>/tests'],
  setupFiles: ['<rootDir>/tests/setupTests.ts'],
  coverageDirectory: '.coverage',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/index.ts',
    '!<rootDir>/src/env.ts',
    '!<rootDir>/src/logger.ts',
    '!<rootDir>/src/main/docs.ts'
  ],
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: {
    mocks: '<rootDir>/mocks',
    '[$]/(.*)': '<rootDir>/src/$1',
    'tests/(.*)': '<rootDir>/tests/$1'
  }
};

export default config;
