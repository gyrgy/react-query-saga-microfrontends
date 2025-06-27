import { lazy, StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GlobalStore } from './store';
import { QueryClientProvider } from '@tanstack/react-query';
import createQueryClient from './queryClient/createQueryClient';
import axiosSetUp from './helpers/axiosSetupHelper';

axiosSetUp();

const queryClient = createQueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

const ThemeProvider = lazy(() => import('./providers/ThemeProvider'));

root.render(
  <StrictMode>
    <GlobalStore>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </GlobalStore>
  </StrictMode>,
);
