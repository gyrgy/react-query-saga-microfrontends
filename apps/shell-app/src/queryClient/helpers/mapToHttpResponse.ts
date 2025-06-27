import { AxiosResponse } from 'axios';
import { HttpResponse } from 'shared/interfaces/queryClient.interface';

// Axios to HttpResponse
const mapToHttpResponse = <T>(
  axiosResponse: AxiosResponse<T>,
): HttpResponse<T> => ({
  data: axiosResponse.data,
  status: axiosResponse.status,
  statusText: axiosResponse.statusText,
  headers: axiosResponse.headers as Record<string, string>,
});

export default mapToHttpResponse;
