import { QueryClient, QueryObserver } from '@tanstack/react-query';
import { StrictQueryKey } from 'shared/interfaces/queryClient.interface';

// Map to track active observers
const activeObservers = new Map<string, () => void>();

export const watchQuery = (
  queryKey: StrictQueryKey,
  queryClient: QueryClient,
) => {
  const key = JSON.stringify(queryKey);
  if (activeObservers.has(key)) return;

  const observer = new QueryObserver(queryClient, { queryKey, enabled: false });
  const unsubscribe = observer.subscribe(() => {
    // Optional: handle updates here
  });

  activeObservers.set(key, unsubscribe);
};

export const stopObserving = (queryKey: StrictQueryKey): void => {
  const key = JSON.stringify(queryKey);
  const unsubscribe = activeObservers.get(key);
  if (unsubscribe) {
    unsubscribe();
    activeObservers.delete(key);
  }
};

export const stopAllObservers = (): void => {
  activeObservers.forEach((unsubscribe) => unsubscribe());
  activeObservers.clear();
};
