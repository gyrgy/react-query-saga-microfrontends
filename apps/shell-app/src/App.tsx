import { FC, Suspense, lazy, useEffect } from 'react';
import loadModule from './moduleLoader';
import { useAppDispatch } from './store';
import { getTodosSaga } from './store/slices/todos/todosSlice';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const RemoteApp = lazy(() => loadModule('remote/App'));

const App: FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Trigger saga call using slice action
    dispatch(getTodosSaga({ userId: 1, completed: false }));
  }, [dispatch]);

  return (
    <Suspense fallback={<div>Loading</div>}>
      <RemoteApp />
    </Suspense>
  );
};

export default App;
