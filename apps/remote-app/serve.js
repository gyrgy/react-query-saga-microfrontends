/* eslint-disable @typescript-eslint/no-require-imports */
require('dotenv').config();
const path = require('path');

const serveLocal = require(path.resolve(__dirname, '../../shared/serveLocal'));

const port = process.env.REACT_APP_DEV_PORT || 3000;

serveLocal(port, __dirname);
