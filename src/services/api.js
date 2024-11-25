// src/services/api.js

import axios from 'axios';

const api = axios.create({
    baseURL: '/', // Используем прокси, поэтому базовый URL можно указать как '/'
    withCredentials: true, // Для отправки и получения cookies (сессионных данных)
});

export default api;


export const login = (email, password) => api.post('/login', { email, password });
export const register = (name, email, password) => api.post('/register', { name, email, password });
export const logout = () => api.post('/logout');
export const checkAuth = () => api.get('/check-auth');

export const getBatches = () => api.get('/batches');
export const getBatchById = (id) => api.get(`/batches/${id}`);
export const createBatch = (data) => api.post('/batches', data);
