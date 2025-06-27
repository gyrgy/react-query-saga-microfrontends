import { ThemeState } from './types';

// Detect initial theme: localStorage first, then system preference
const getInitialThemeMode = (): ThemeState['mode'] => {
  if (typeof window !== 'undefined') {
    // First check localStorage for user preference
    const savedTheme = localStorage.getItem('theme-mode');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    // Fall back to system preference if no saved preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return 'light'; // fallback for SSR
};

const themeInitialState: ThemeState = {
  mode: getInitialThemeMode(),
};

export default themeInitialState;
