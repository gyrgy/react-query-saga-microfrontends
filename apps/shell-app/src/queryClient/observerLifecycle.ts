import { stopAllObservers } from './observer';

const setupObserverLifecycle = () => {
  const originalPush = history.pushState;
  const originalReplace = history.replaceState;

  const onUrlChange = () => {
    stopAllObservers();
  };

  // Patch pushState
  history.pushState = function (...args) {
    originalPush.apply(this, args);
    onUrlChange();
  };

  // Patch replaceState
  history.replaceState = function (...args) {
    originalReplace.apply(this, args);
    onUrlChange();
  };

  // Listen for back/forward buttons
  window.addEventListener('popstate', onUrlChange);

  // Cleanup before tab unload
  window.addEventListener('beforeunload', onUrlChange);
};

export default setupObserverLifecycle;
