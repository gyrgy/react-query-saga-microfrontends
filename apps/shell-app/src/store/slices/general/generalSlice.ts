import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import generalInitialState from './generalInitialState';

const generalSlice = createSlice({
  name: 'general',
  initialState: generalInitialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => ({
      ...state,
      loading: action.payload,
    }),
    setError: (state, action: PayloadAction<boolean>) => ({
      ...state,
      error: action.payload,
    }),
  },
});

export const { setLoading: setLoadingAction, setError: setErrorAction } =
  generalSlice.actions;

export default generalSlice.reducer;
