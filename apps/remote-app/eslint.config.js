/* eslint-disable @typescript-eslint/no-require-imports */
const createAppConfig = require('../../eslint.config');

const config = createAppConfig(__dirname, [
  {
    settings: {
      'import/core-modules': ['shell/ThemeProvider'],
    },
  },
]);

module.exports = config;
