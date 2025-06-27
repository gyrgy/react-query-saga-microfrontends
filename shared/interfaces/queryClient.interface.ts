// Core types - no external dependencies
export type StrictQueryKey = [url: string, params?: Record<string, unknown>];

export interface FetchQueryOptions {
  staleTime?: number;
  gcTime?: number;
  retry?: boolean | number;
  invalidateCache?: boolean;
}

export interface MutationOptions<TVariables = unknown> {
  url: string;
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  variables?: TVariables;
  invalidateQueries?: StrictQueryKey[];
}

// Our own HTTP response type - clean and dependency-free, maps to AxiosResponse
export interface HttpResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

// Query Client Interface - Only functions that other apps need
export interface IQueryClient {
  // Data fetching - returns our own response type
  fetchData<TResponseData = unknown>(
    queryKey: StrictQueryKey,
    options?: FetchQueryOptions
  ): Promise<HttpResponse<TResponseData>>;

  // Data mutation
  mutateData<TResponseData = unknown, TVariables = unknown>(
    options: MutationOptions<TVariables>
  ): Promise<HttpResponse<TResponseData>>;

  // Cache management
  invalidateCache(queryKey: StrictQueryKey): Promise<void>;
  removeCache(queryKey: StrictQueryKey): void;
  getCache<TResponseData = unknown>(
    queryKey: StrictQueryKey
  ): HttpResponse<TResponseData> | undefined;
  setCache<TResponseData = unknown>(
    queryKey: StrictQueryKey,
    data: HttpResponse<TResponseData>,
    options?: { updatedAt?: number }
  ): void;

  stopObserving(queryKey: StrictQueryKey): void;
  stopAllObservers(): void;
}
