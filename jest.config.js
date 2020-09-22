module.exports = {
  roots: ["<rootDir>/src"],
  coverageProvider: "v8",
  testEnvironment: "node",
  collectCoverageFrom: ["<rootDir>/src/**/**.ts"],
  transform: {
    ".+\\.ts$": "ts-jest",
  },
};
