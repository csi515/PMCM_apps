import axios from 'axios';
import { AuthUtils } from '../utils/auth';

// Use environment variable or default to localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Request Interceptor: Add Token
api.interceptors.request.use(
    (config) => {
        const token = AuthUtils.getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle 401
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Auto-logout on 401
            AuthUtils.removeCurrentUser();
            // Optionally redirect to login or trigger global event
            // window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);
