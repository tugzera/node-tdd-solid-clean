module.exports = {
  roots: ["<rootDir>/src"],
  coverageProvider: "v8",
  testEnvironment: "node",
  collectCoverageFrom: [
    "<rootDir>/src/**/**.ts",
    "!<rootDir>/src/main/**.ts",
],
  transform: {
    ".+\\.ts$": "ts-jest",
  },
  preset: '@shelf/jest-mongodb'
};
