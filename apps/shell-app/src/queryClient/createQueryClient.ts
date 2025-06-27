import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { StrictQueryKey } from 'shared/interfaces/queryClient.interface';
import { watchQuery } from './observer';
// Query client creation
export const createQueryClient = () => {
  try {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          queryFn: async ({ queryKey }) => {
            const [url, params = {}] = queryKey as StrictQueryKey;

            if (typeof url !== 'string') {
              throw new Error('First element of queryKey must be a URL string');
            }

            const response = await axios.get(url, { params });
            return response; // AxiosResponse
          },
          staleTime: 10_000,
          gcTime: 30_000,
          retry: 3,
          refetchOnWindowFocus: false,
          refetchOnMount: false,
        },
      },
    });

    // Wrap fetchQuery to auto-observe
    const originalFetchQuery = client.fetchQuery.bind(client);
    client.fetchQuery = async (options) => {
      watchQuery(options.queryKey as unknown as StrictQueryKey, client);
      return originalFetchQuery(options);
    };

    return client;
  } catch (error: unknown) {
    console.error('Critical: query client setup failed:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Application initialization failed: ${errorMessage}`);
  }
};
