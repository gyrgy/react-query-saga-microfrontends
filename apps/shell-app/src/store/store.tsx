import { FC, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import generalReducer from './slices/general/generalSlice';
import themeReducer from './slices/theme/themeSlice';
import todosReducer from './slices/todos/todosSlice';
import { themeListenerMiddleware } from './middleware/themeListener';
import rootSaga from './sagas/rootSaga';

const enableDevTools = process.env.NODE_ENV === 'development';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    general: generalReducer,
    theme: themeReducer,
    todos: todosReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(themeListenerMiddleware.middleware)
      .concat(sagaMiddleware),
  devTools: enableDevTools,
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

interface GlobalStoreProps {
  children: ReactNode;
}

const GlobalStore: FC<GlobalStoreProps> = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);

export default GlobalStore;
