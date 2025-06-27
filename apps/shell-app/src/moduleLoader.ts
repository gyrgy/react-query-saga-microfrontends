import { init, loadRemote } from '@module-federation/runtime';
import { createModuleLoader } from 'shared/module-federation/remoteModuleLoader';

const remote = {
  name: 'remote',
  entry: `${process.env.REACT_APP_REMOTE_APP_REMOTE_URL}/remoteEntryRemote.js`,
};

init({
  name: 'shell',
  remotes: [remote],
});

const loadModule = createModuleLoader({
  loadRemote,
  sentryCapture: (error) => console.error(error),
});

export default loadModule;
