import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import themeInitialState from './themeInitialState';
import { ThemeState } from './types';

const themeSlice = createSlice({
  name: 'theme',
  initialState: themeInitialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeState['mode']>) => {
      state.mode = action.payload;
    },
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
  },
});

export const {
  setThemeMode: setThemeModeAction,
  toggleTheme: toggleThemeAction,
} = themeSlice.actions;

export default themeSlice.reducer;
