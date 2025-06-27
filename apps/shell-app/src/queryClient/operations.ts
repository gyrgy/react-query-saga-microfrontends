import {
  StrictQueryKey,
  HttpResponse,
  FetchQueryOptions,
  MutationOptions,
} from 'shared/interfaces/queryClient.interface';
import { stopObserving, stopAllObservers } from './observer';
import {
  invalidateCacheHelper,
  removeCacheHelper,
  getCacheHelper,
  setCacheHelper,
} from './cacheOperations';
import { fetchDataHelper } from './helpers/fetchData';
import { mutateDataHelper } from './helpers/mutateData';
import { queryClient } from '../bootstrap';

export const mutateData = async <TResponseData = unknown, TVariables = unknown>(
  options: MutationOptions<TVariables>,
): Promise<HttpResponse<TResponseData>> =>
  mutateDataHelper<TResponseData, TVariables>(queryClient, options);

export const fetchData = <TResponseData = unknown>(
  queryKey: StrictQueryKey,
  options: FetchQueryOptions = {},
): Promise<HttpResponse<TResponseData>> =>
  fetchDataHelper(queryClient, queryKey, options);

export const invalidateCache = (queryKey: StrictQueryKey): Promise<void> =>
  invalidateCacheHelper(queryClient, queryKey);

export const removeCache = (queryKey: StrictQueryKey): void =>
  removeCacheHelper(queryClient, queryKey);

export const getCache = <TResponseData = unknown>(
  queryKey: StrictQueryKey,
): HttpResponse<TResponseData> | undefined =>
  getCacheHelper<TResponseData>(queryClient, queryKey);

export const setCache = <TResponseData = unknown>(
  queryKey: StrictQueryKey,
  data: HttpResponse<TResponseData>,
  options?: { updatedAt?: number },
): void => setCacheHelper<TResponseData>(queryClient, queryKey, data, options);

export { stopObserving, stopAllObservers };
