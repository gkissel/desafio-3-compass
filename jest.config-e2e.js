// jest.config.js
module.exports = {
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'json', 'ts'],
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  collectCoverage: true,
  testEnvironment: 'node',
  modulePaths: ['<rootDir>'],
  coverageDirectory: '../coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  testMatch: ['**/*.e2e-spec.ts'],
  rootDir: './',
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
    '@test/(.*)': '<rootDir>/test/$1',
  },
  setupFilesAfterEnv: ['./test/setup-e2e.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/data/pg/'],
  testTimeout: 30000,
}
