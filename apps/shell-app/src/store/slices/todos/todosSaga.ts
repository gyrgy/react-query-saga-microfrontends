import { call, put, takeEvery } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import type { SagaIterator } from 'redux-saga';
import {
  getTodosSaga,
  setTodosLoadingAction,
  setTodosErrorAction,
  setTodosAction,
} from './todosSlice';
import { AxiosResponse } from 'axios';
import { Todo } from './types';
import { fetchData } from '../../../queryClient/createQueryClient';

// Saga workers
function* fetchTodosSaga(
  action: PayloadAction<{ userId?: number; completed?: boolean }>,
): SagaIterator {
  try {
    yield put(setTodosLoadingAction(true));
    yield put(setTodosErrorAction(null)); // Clear previous errors

    const response: AxiosResponse<Todo[]> = yield call(fetchData<Todo[]>, [
      'todos',
      action.payload,
    ]);

    yield put(setTodosAction(response.data));
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch todos';
    yield put(setTodosErrorAction(errorMessage));
  } finally {
    yield put(setTodosLoadingAction(false));
  }
}

// Saga watchers
export function* watchTodosSaga(): SagaIterator {
  yield takeEvery(getTodosSaga.type, fetchTodosSaga);
}
