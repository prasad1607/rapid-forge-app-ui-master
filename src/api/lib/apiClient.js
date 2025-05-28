  // import axios from 'axios';

  // const apiClient = axios.create({
  //   baseURL: 'https://api.example.com',
  //   timeout: 8000,
  //   headers: { 'Content-Type': 'application/json' },
  // });

  // // Attach auth token for protected routes
  // apiClient.interceptors.request.use((config) => {
  //   const token = localStorage.getItem('authToken');
  //   if (token) config.headers.Authorization = `Bearer ${token}`;
  //   return config;
  // });

  // export default apiClient;


import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8086/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth token for protected routes
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default apiClient;

