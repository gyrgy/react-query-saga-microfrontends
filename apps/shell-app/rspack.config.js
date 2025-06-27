/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');
require('dotenv').config();
const { defineConfig } = require('@rspack/cli');
const { DefinePlugin } = require('@rspack/core');
const {
  ModuleFederationPlugin,
} = require('@module-federation/enhanced/rspack');
const rootDeps = require('../../package.json').dependencies;

const sharedConfig = require(
  path.resolve(__dirname, '../../shared/rspack.shared.config'),
);

module.exports = () => {
  const commonConfig = sharedConfig(__dirname, process.env.REACT_APP_DEV_PORT);

  const config = defineConfig({
    ...commonConfig,
    output: {
      ...commonConfig.output,
      publicPath: `${process.env.REACT_APP_SHELL_REMOTE_URL}/`,
    },
    plugins: [
      ...commonConfig.plugins,
      new DefinePlugin({
        'process.env.REACT_APP_SENTRY_DSN': JSON.stringify(
          process.env.REACT_APP_SENTRY_DSN,
        ),
        'process.env.REACT_APP_DEV_PORT': JSON.stringify(
          process.env.REACT_APP_DEV_PORT,
        ),
        'process.env.REACT_APP_API_BASE_URL': JSON.stringify(
          process.env.REACT_APP_API_BASE_URL,
        ),
        'process.env.REACT_APP_REMOTE_APP_REMOTE_URL': JSON.stringify(
          process.env.REACT_APP_REMOTE_APP_REMOTE_URL,
        ),
      }),
      new ModuleFederationPlugin({
        name: 'shell',
        exposes: {
          './ThemeProvider': './src/providers/ThemeProvider',
          './queryClient': './src/queryClient/exposed',
          './useAppSelector': './src/store/hooks',
          './useAppDispatch': './src/store/hooks',
          './actions': './src/store/exposedActions/exposedActions',
        },
        filename: 'remoteEntryShell.js',
        disableDynamicRemoteTypeHints: true,
        dts: false,
        disableHotTypesReload: true,
        runtimePlugins: [],
        shared: {
          './src/providers/ThemeProvider': {},
          './src/queryClient/createQueryClient': {},
          react: {
            singleton: true,
            requiredVersion: rootDeps.react,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: rootDeps['react-dom'],
          },
          '@emotion/core': {
            singleton: true,
            requiredVersion: rootDeps['@emotion/core'],
          },
          '@emotion/react': {
            singleton: true,
            requiredVersion: rootDeps['@emotion/react'],
          },
          '@emotion/styled': {
            singleton: true,
            requiredVersion: rootDeps['@emotion/styled'],
          },
          '@fontsource/roboto': {
            singleton: true,
            requiredVersion: rootDeps['@fontsource/roboto'],
          },
          '@mui/material': {
            singleton: true,
            requiredVersion: rootDeps['@mui/material'],
          },
          '@reduxjs/toolkit': {
            singleton: true,
            requiredVersion: rootDeps['@reduxjs/toolkit'],
          },
          'react-redux': {
            singleton: true,
            requiredVersion: rootDeps['react-redux'],
          },
          'redux-saga': {
            singleton: true,
            requiredVersion: rootDeps['redux-saga'],
          },
        },
      }),
    ],
  });

  return config;
};
