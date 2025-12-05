import { config } from '@/config/config';
import axios from 'axios';

const api = axios.create({
    baseURL: config.app.API_URL,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        let isRedirecting = false;
        if (error.response?.status === 401 && !originalRequest._retry && !isRedirecting) {
            originalRequest._retry = true;

            if (window.location.pathname !== '/') {
                isRedirecting = true;
                window.location.href = '/';
            }
        }

        return Promise.reject(error);
    }
);

export default api;
