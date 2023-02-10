/* eslint-ignore */
const path = require('path');

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: path.resolve(__dirname, '../..'),
  roots: ['<rootDir>/packages'],
  coverageDirectory: '<rootDir>/coverage',
  moduleNameMapper: {
    '^@kitajs/(.*)$': '<rootDir>/packages/$1/src'
  },
  coveragePathIgnorePatterns: ['<rootDir>/packages/tests', 'node_modules'],
  testTimeout: 10000,
  maxConcurrency: 1000,
  transform: {
    '^.+\\.m?[tj]sx?$': [
      'ts-jest',
      {
        isolatedModules: true
      }
    ]
  }
};
