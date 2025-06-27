import {
  FC,
  createContext,
  ReactNode,
  useContext,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
  CssBaseline,
  useMediaQuery,
} from '@mui/material';
import { useAppSelector, useAppDispatch } from '../store';
import {
  setThemeModeAction,
  toggleThemeAction,
} from '../store/slices/theme/themeSlice';

interface ThemeContextType {
  themeMode: 'light' | 'dark';
  theme: import('@mui/material/styles').Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'light',
  theme: createTheme(),
  toggleTheme: () => {
    throw new Error(
      "toggleTheme cannot be called outside of the ThemeProvider's context.",
    );
  },
});

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.theme.mode);

  useEffect(() => {
    // Only sync with system preference if user hasn't saved a preference
    const savedTheme = localStorage.getItem('theme-mode');
    if (!savedTheme) {
      dispatch(setThemeModeAction(prefersDarkMode ? 'dark' : 'light'));
    }
  }, [dispatch, prefersDarkMode]);

  const toggleTheme = useCallback(() => {
    dispatch(toggleThemeAction());
  }, [dispatch]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode,
        },
      }),
    [themeMode],
  );

  const providerValue = useMemo(
    () => ({
      themeMode,
      theme,
      toggleTheme,
    }),
    [theme, themeMode, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={providerValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

export const useThemeContext = () => useContext(ThemeContext);
