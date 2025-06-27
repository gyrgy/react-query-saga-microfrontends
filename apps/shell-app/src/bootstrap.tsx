import { lazy, StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GlobalStore } from './store';
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from './queryClient/createQueryClient';
import axiosSetUp from './helpers/axiosSetupHelper';
import setupObserverLifecycle from './queryClient/observerLifecycle';

axiosSetUp();
export const queryClient = createQueryClient();
setupObserverLifecycle();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

const ThemeProvider = lazy(() => import('./providers/ThemeProvider'));

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <GlobalStore>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </GlobalStore>
    </QueryClientProvider>
  </StrictMode>,
);
