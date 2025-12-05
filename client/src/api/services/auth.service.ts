import api from "../api";

export const authService = {
    login: async () => {
        const response = await api.get('/auth/login/github');
        return response.data;
    },
    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },
    logoutAll: async () => {
        const response = await api.post('/auth/logout-all');
        return response.data;
    },
    refresh: async () => {
        const response = await api.post('/auth/refresh');
        return response.data;
    },
    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        console.log('AuthService getCurrentUser response:', response?.data);
        return response.data;
    }
}