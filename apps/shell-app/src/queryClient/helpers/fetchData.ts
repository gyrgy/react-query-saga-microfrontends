import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';
import mapToHttpResponse from './mapToHttpResponse';
import {
  StrictQueryKey,
  FetchQueryOptions,
  HttpResponse,
} from 'shared/interfaces/queryClient.interface';

export const fetchDataHelper = <TResponseData = unknown>(
  queryClient: QueryClient,
  queryKey: StrictQueryKey,
  options: FetchQueryOptions = {},
): Promise<HttpResponse<TResponseData>> => {
  const { invalidateCache: shouldInvalidate, ...queryOptions } = options;

  if (shouldInvalidate) {
    queryClient.invalidateQueries({ queryKey });
  }

  return queryClient.fetchQuery({
    queryKey,
    queryFn: async () => {
      const [url, params = {}] = queryKey;
      const response = await axios.get<TResponseData>(url, { params });
      return mapToHttpResponse(response);
    },
    ...queryOptions,
  });
};
