import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Type guard functions
export const isAuthResponse = (data: unknown): data is { user: any; token: string } => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'user' in data &&
    'token' in data &&
    typeof (data as any).token === 'string'
  );
};

export const isUser = (data: unknown): data is any => {
  return (
    typeof data === 'object' &&
    data !== null &&
    '_id' in data &&
    'email' in data &&
    'firstName' in data &&
    'lastName' in data &&
    'role' in data
  );
};

export const isProject = (data: unknown): data is any => {
  return (
    typeof data === 'object' &&
    data !== null &&
    '_id' in data &&
    'name' in data &&
    'client' in data &&
    'type' in data &&
    'status' in data
  );
};

export const isProjectResponse = (data: unknown): data is { projects: any[]; total: number; page: number; limit: number } => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'projects' in data &&
    'total' in data &&
    'page' in data &&
    'limit' in data &&
    Array.isArray((data as any).projects)
  );
};

export default axiosInstance; 