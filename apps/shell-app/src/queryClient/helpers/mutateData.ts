import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  MutationOptions,
  HttpResponse,
} from 'shared/interfaces/queryClient.interface';
import mapToHttpResponse from './mapToHttpResponse';

export const mutateDataHelper = async <
  TResponseData = unknown,
  TVariables = unknown,
>(
  queryClient: QueryClient,
  options: MutationOptions<TVariables>,
): Promise<HttpResponse<TResponseData>> => {
  const { url, method, variables, invalidateQueries } = options;

  try {
    const response = await axios.request<TResponseData>({
      url,
      method,
      data: variables,
    });

    if (invalidateQueries) {
      invalidateQueries.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
    }

    return mapToHttpResponse(response);
  } catch (error) {
    console.error(`Mutation failed: ${method} ${url}`, error);
    throw error;
  }
};
