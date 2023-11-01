import { getToken } from '@/components/utils/localStorage';
import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.BASE_URL,
});

instance.interceptors.request.use(
  (config) => {
    config.headers['Authorization'] = getToken();
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);
instance.interceptors.response.use(
  (response) => {
    const token = response.data.data.token;
    if (token) {
      localStorage.setItem('token', token);
    }
    return response;
  },
  (error) => {
    // Handle response error
    return Promise.reject(error);
  }
);

export default instance;
