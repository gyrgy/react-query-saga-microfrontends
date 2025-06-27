import { all, fork } from 'redux-saga/effects';
import { watchTodosSaga } from '../slices/todos/todosSaga';

export default function* rootSaga() {
  yield all([
    fork(watchTodosSaga),
    // Add more sagas here
  ]);
}
