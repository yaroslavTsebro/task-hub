const path = require('path');
module.exports = {
  roots: ['<rootDir>/tests'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverage: true,
  testEnvironment: 'node',
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts$',
  moduleNameMapper: {
    '^src/(.*)$': path.resolve(__dirname, 'src/$1'),
  },
};
