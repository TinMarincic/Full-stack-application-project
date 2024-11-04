module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    moduleNameMapper: {
      "\\.(css|scss)$": "identity-obj-proxy"
    },
    transform: {
      '^.+\\.[tj]sx?$': 'babel-jest',
    },
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  };
  