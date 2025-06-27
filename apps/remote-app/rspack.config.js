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
      publicPath: `${process.env.REACT_APP_REMOTE_APP_REMOTE_URL}/`,
    },
    plugins: [
      ...commonConfig.plugins,
      new DefinePlugin({
        'process.env.REACT_APP_DEV_PORT': JSON.stringify(
          process.env.REACT_APP_DEV_PORT,
        ),
        'process.env.REACT_APP_REMOTE_APP_REMOTE_URL': JSON.stringify(
          process.env.REACT_APP_REMOTE_APP_REMOTE_URL,
        ),
      }),
      new ModuleFederationPlugin({
        name: 'remote',
        exposes: {
          './App': './src/App',
        },
        filename: 'remoteEntryRemote.js',
        remotes: {
          shell: `shell@${process.env.REACT_APP_SHELL_REMOTE_URL}/remoteEntryShell.js`,
        },
        disableDynamicRemoteTypeHints: true,
        dts: false,
        disableHotTypesReload: true,
        runtimePlugins: [],
        shared: {
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
        },
      }),
    ],
  });

  return config;
};
