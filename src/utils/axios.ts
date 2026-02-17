import axios, { type AxiosError } from 'axios';
import { HttpStatusCode } from 'axios';
import { notifications } from '@mantine/notifications';
import { API_HOST } from '@config/api';

axios.defaults.baseURL = API_HOST;
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

axios.interceptors.request.use((config) => {
  if (config.baseURL && typeof config.url === 'string' && config.url.startsWith('/') && !config.url.startsWith('//') && !config.url.startsWith('http')) {
    config.url = config.url.slice(1);
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response?.data as { message?: string } | undefined;
      const errorMessage = errorData?.message;

      switch (status) {
        case HttpStatusCode.Unauthorized:
          notifications.show({
            title: 'Unauthorized',
            message: errorMessage ?? 'Please log in again.',
            color: 'red',
            autoClose: 3000,
          });
          break;
        case HttpStatusCode.Forbidden:
          notifications.show({
            title: 'Forbidden',
            message: errorMessage ?? 'You do not have permission.',
            color: 'red',
            autoClose: 3000,
          });
          break;
        case HttpStatusCode.TooManyRequests:
          notifications.show({
            title: 'Too many requests',
            message: errorMessage ?? 'Please try again later.',
            color: 'orange',
            autoClose: 3000,
          });
          break;
        default:
          notifications.show({
            title: 'Error',
            message: errorMessage ?? 'An error occurred.',
            color: 'red',
            autoClose: 5000,
          });
      }
    } else if (error.code === 'ERR_NETWORK') {
      notifications.show({
        title: 'Network Error',
        message: 'Unable to connect to the server.',
        color: 'red',
        autoClose: 5000,
      });
    }
    return Promise.reject(error);
  }
);

export default axios;
