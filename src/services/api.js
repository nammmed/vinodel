// src/services/api.js

import axios from 'axios';

const api = axios.create({
    baseURL: '/',
    withCredentials: true,
});

export default api;

// Аутентификация
export const login = (email, password) => api.post('/login', {email, password});
export const register = (name, email, password) => api.post('/register', {name, email, password});
export const logout = () => api.post('/logout');
export const checkAuth = () => api.get('/check-auth');

// Партии
export const getBatches = () => api.get('/batches');
export const getBatchById = (id) => api.get(`/batches/${id}`);
export const createBatch = (data) => api.post('/batches', data);

// Виноград
export const getGrapes = () => api.get('/grapes');
export const getGrapeById = (id) => api.get(`/grapes/${id}`);
export const createGrape = (data) => api.post('/grapes', data);
export const updateGrape = (id, data) => api.put(`/grapes/${id}`, data);
export const deleteGrape = (id) => api.delete(`/grapes/${id}`);