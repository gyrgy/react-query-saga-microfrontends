import { QueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from 'axios';
import {
  StrictQueryKey,
  FetchQueryOptions,
  HttpResponse,
  MutationOptions,
} from 'shared/interfaces/queryClient.interface';

const createQueryClient = () => {
  try {
    // Create query client with global queryFn
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          queryFn: async ({ queryKey }) => {
            const [url, params = {}] = queryKey as StrictQueryKey;

            if (typeof url !== 'string') {
              throw new Error('First element of queryKey must be a URL string');
            }

            const response = await axios.get(url, { params });
            return response; // Return full AxiosResponse
          },
          staleTime: 10 * 1000, // 10 seconds
          gcTime: 30 * 1000, // 30 seconds
          retry: 3,
          refetchOnWindowFocus: false,
          refetchOnMount: false,
        },
      },
    });

    return queryClient;
  } catch (error: unknown) {
    console.error('Critical: query client setup failed:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Application initialization failed: ${errorMessage}`);
  }
};

// Create the single instance
const queryClient = createQueryClient();

// Helper function to map axios response to our HttpResponse
const mapToHttpResponse = <T>(
  axiosResponse: AxiosResponse<T>,
): HttpResponse<T> => ({
  data: axiosResponse.data,
  status: axiosResponse.status,
  statusText: axiosResponse.statusText,
  headers: axiosResponse.headers as Record<string, string>,
});

// Implementation - returns our HttpResponse type
export const fetchData = <TResponseData = unknown>(
  queryKey: StrictQueryKey,
  options: FetchQueryOptions = {},
): Promise<HttpResponse<TResponseData>> => {
  const { invalidateCache: shouldInvalidate, ...queryOptions } = options;

  // Invalidate cache first if requested
  if (shouldInvalidate) {
    queryClient.invalidateQueries({ queryKey });
  }

  return queryClient.fetchQuery({
    queryKey,
    queryFn: async () => {
      const [url, params = {}] = queryKey;

      if (typeof url !== 'string') {
        throw new Error('First element of queryKey must be a URL string');
      }

      const response = await axios.get<TResponseData>(url, { params });
      return mapToHttpResponse(response);
    },
    ...queryOptions,
  });
};

// Implementation - handles data mutation
export const mutateData = async <TResponseData = unknown, TVariables = unknown>(
  options: MutationOptions<TVariables>,
): Promise<HttpResponse<TResponseData>> => {
  const { url, method, variables, invalidateQueries } = options;

  try {
    const response = await axios.request<TResponseData>({
      url,
      method,
      data: variables,
    });

    // Invalidate specified queries on success
    if (invalidateQueries) {
      invalidateQueries.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
    }

    return mapToHttpResponse(response);
  } catch (error) {
    console.error(`Mutation failed: ${method} ${url}`, error);
    // Re-throw to allow the caller to handle it
    throw error;
  }
};

export const invalidateCache = (queryKey: StrictQueryKey): Promise<void> =>
  queryClient.invalidateQueries({ queryKey });

export const removeCache = (queryKey: StrictQueryKey): void => {
  queryClient.removeQueries({ queryKey });
};

export const getCache = <TResponseData = unknown>(
  queryKey: StrictQueryKey,
): HttpResponse<TResponseData> | undefined => {
  const cachedData = queryClient.getQueryData(queryKey);
  return cachedData as HttpResponse<TResponseData> | undefined;
};

export const setCache = <TResponseData = unknown>(
  queryKey: StrictQueryKey,
  data: HttpResponse<TResponseData>,
  options?: { updatedAt?: number },
): void => {
  queryClient.setQueryData(queryKey, data, options);
};

// Export the creator for shell app use
export default createQueryClient;
