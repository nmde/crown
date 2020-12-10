module.exports = {
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  globals: {
    'ts-jest': {
      astTransformers: {
        before: ['tests/keys-transformer.js'],
      },
    },
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
};
