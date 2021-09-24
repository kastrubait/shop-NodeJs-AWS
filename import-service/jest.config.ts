/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  globals: {
    allowSyntheticDefaultImports: true,
  },
  testEnvironment: 'node',
  moduleNameMapper: {
    "^@libs/(.*)$": "<rootDir>/src/libs/$1",
    "^@functions/(.*)$": "<rootDir>/src/functions/$1",
  }
};
