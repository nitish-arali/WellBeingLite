import axios from 'axios';

const customAxios = axios.create({
  // Define default headers here
  headers: {
    'Content-Type': 'application/json', // Add other default headers as needed
  },
});

// Add an interceptor to set the Authorization header if a token is available
customAxios.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default customAxios;
