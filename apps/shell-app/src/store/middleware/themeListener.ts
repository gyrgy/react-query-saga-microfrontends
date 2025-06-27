import { createListenerMiddleware } from '@reduxjs/toolkit';
import { toggleThemeAction } from '../slices/theme/themeSlice';

export const themeListenerMiddleware = createListenerMiddleware();

// Listen for theme toggle and save to localStorage
themeListenerMiddleware.startListening({
  actionCreator: toggleThemeAction,
  effect: (_action, listenerApi) => {
    const state = listenerApi.getState() as {
      theme: { mode: 'light' | 'dark' };
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme-mode', state.theme.mode);
    }
  },
});
