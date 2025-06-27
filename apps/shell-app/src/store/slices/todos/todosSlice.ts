import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import todosInitialState from './todosInitialState';
import { Todo } from './types';

const todosSlice = createSlice({
  name: 'todos',
  initialState: todosInitialState,
  reducers: {
    // State mutation actions (called by sagas)
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      state.todos = action.payload;
    },

    // Saga trigger actions
    getTodosSaga: (
      _state,
      _action: PayloadAction<{ userId?: number; completed?: boolean }>,
    ) => {
      // Pure trigger - no state changes
    },
    postTodoSaga: (
      _state,
      _action: PayloadAction<{ title: string; userId: number }>,
    ) => {
      // Pure trigger - no state changes
    },
    putTodoSaga: (
      _state,
      _action: PayloadAction<{
        id: number;
        title?: string;
        completed?: boolean;
      }>,
    ) => {
      // Pure trigger - no state changes
    },
    deleteTodoSaga: (_state, _action: PayloadAction<{ id: number }>) => {
      // Pure trigger - no state changes
    },
  },
});

export const {
  // State mutations
  setLoading: setTodosLoadingAction,
  setError: setTodosErrorAction,
  setTodos: setTodosAction,
  // Saga triggers
  getTodosSaga,
  postTodoSaga,
  putTodoSaga,
  deleteTodoSaga,
} = todosSlice.actions;

export default todosSlice.reducer;
