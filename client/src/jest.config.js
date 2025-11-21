module.exports = {
    testEnvironment: 'jsdom', // Simulates a browser environment for React
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'], // Custom setup file
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS imports
    },
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest', // Transform JS/JSX with Babel
    },
    transformIgnorePatterns: [
      '/node_modules/',
      '\\.pnp\\.[^\\/]+$'
    ]
  };