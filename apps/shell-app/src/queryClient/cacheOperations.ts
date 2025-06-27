import { QueryClient } from '@tanstack/react-query';
import {
  StrictQueryKey,
  HttpResponse,
} from 'shared/interfaces/queryClient.interface';

export const invalidateCacheHelper = (
  queryClient: QueryClient,
  queryKey: StrictQueryKey,
): Promise<void> => queryClient.invalidateQueries({ queryKey });

export const removeCacheHelper = (
  queryClient: QueryClient,
  queryKey: StrictQueryKey,
): void => {
  queryClient.removeQueries({ queryKey });
};

export const getCacheHelper = <TResponseData = unknown>(
  queryClient: QueryClient,
  queryKey: StrictQueryKey,
): HttpResponse<TResponseData> | undefined => {
  const cachedData = queryClient.getQueryData(queryKey);
  return cachedData as HttpResponse<TResponseData> | undefined;
};

export const setCacheHelper = <TResponseData = unknown>(
  queryClient: QueryClient,
  queryKey: StrictQueryKey,
  data: HttpResponse<TResponseData>,
  options?: { updatedAt?: number },
): void => {
  queryClient.setQueryData(queryKey, data, options);
};
