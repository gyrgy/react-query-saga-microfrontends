import axios from 'axios';

const axiosSetUp = () => {
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  axios.defaults.headers.post.Accept = 'application/json';

  axios.interceptors.request.use(
    (config) => {
      const { withBaseUrl = true } = config;

      if (withBaseUrl) {
        config.baseURL = process.env.REACT_APP_API_BASE_URL;
      }

      // possible additions are header settings, other config, token handling, retrying etc.

      return config;
    },
    (error) => Promise.reject(error),
  );

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      console.error(error);
      // more advance error handling comes here, for example sentry
      return Promise.reject(error);
    },
  );
};

export default axiosSetUp;
