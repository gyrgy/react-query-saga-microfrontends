import { FC, useCallback } from 'react';
import {
  Button,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Card,
  CardContent,
  Grid2 as Grid,
} from '@mui/material';
import { useThemeContext } from 'shell/ThemeProvider';
import { fetchData, mutateData } from 'shell/queryClient';
import { useAppSelector } from 'shell/useAppSelector';
import { useAppDispatch } from 'shell/useAppDispatch';
import { getTodosSaga } from 'shell/actions';

interface TestData {
  id: number;
  title: string;
  completed: boolean;
}

const App: FC = () => {
  const { themeMode, toggleTheme } = useThemeContext();
  const dispatch = useAppDispatch();
  const todos = useAppSelector((state) => state.todos);

  const handleGetTodos = useCallback(() => {
    dispatch(getTodosSaga({ userId: 1, completed: false }));
  }, [dispatch]);

  const handleGetTodosLocally = useCallback(async () => {
    try {
      // Test the query client strict cache. Only for testing purposes, should respect the cache until it's valid
      await fetchData<TestData[]>(['todos', { userId: 1, completed: false }]);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  }, []);

  const handlePostTodo = useCallback(async () => {
    try {
      await mutateData<TestData>({
        url: 'todos',
        method: 'POST',
        variables: { title: 'A new Todo', completed: false, userId: 1 },
        invalidateQueries: [['todos', { userId: 1, completed: false }]],
      });

      // We dispatch to ensure the Redux store is updated
      dispatch(getTodosSaga({ userId: 1, completed: false }));
    } catch (error) {
      console.error('Post error:', error);
    }
  }, [dispatch]);

  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        p: 2,
      }}
    >
      <Typography variant="h6">Remote App</Typography>
      <Typography variant="body1">themeMode: {themeMode}</Typography>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Button onClick={toggleTheme}>Toggle Theme</Button>
        <Button onClick={handleGetTodos}>Fetch Todos</Button>
        <Button onClick={handleGetTodosLocally}>Fetch Todos Locally</Button>
        <Button onClick={handlePostTodo}>Post Todo and Refetch</Button>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Todos</Typography>
        {todos.loading && <CircularProgress />}
        {todos.error && (
          <Typography color="error">Error: {todos.error}</Typography>
        )}
        {!todos.loading && !todos.error && (
          <Grid container spacing={2}>
            {todos.todos.map((todo) => (
              <Grid key={todo.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="body1">{todo.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {`Completed: ${todo.completed}`}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Paper>
  );
};

export default App;
