import { config } from '@/config/config';
import { STORAGE_KEYS } from '@/utils';
import axios from 'axios';

const api = axios.create({
    baseURL: config.app.API_URL,
    withCredentials: true, // Include cookies in requests
})

// interceptors
api.interceptors.request.use((config: any) => {

    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// response interceptor to handle 401 errors > check if its a token expiration > try to refresh token then retry original request
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // attempt to refresh the access token
                const refreshResponse = await api.post('/auth/refresh');

                if (refreshResponse.data.success) {
                    const newAccessToken = refreshResponse.data.data.accessToken;
                    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);

                    // update the authorization header
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                    // retry the original request
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // clear storage and redirect to auth
                localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.USER);

                window.location.href = '/auth';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;