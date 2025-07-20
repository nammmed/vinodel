// src/services/api.js

import axios from 'axios';

const api = axios.create({
    baseURL: '/server/',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
});

export default api;

// Аутентификация
export const login = (email, password) => api.post('/login', {email, password});
export const register = (name, email, password) => api.post('/register', {name, email, password});
export const logout = () => api.post('/logout');
export const checkAuth = () => api.get('/check-auth');

// Виноград
export const getGrapes = () => api.get('/grapes');
export const getGrapeById = (id) => api.get(`/grapes/${id}`);
export const createGrape = (data) => api.post('/grapes', data);
export const updateGrape = (id, data) => api.put(`/grapes/${id}`, data);
export const deleteGrape = (id) => api.delete(`/grapes/${id}`);

// Партии
export const getBatches = () => api.get('/batches');
export const getBatchById = (id) => api.get(`/batches/${id}`);
export const createBatch = (data) => api.post('/batches', data);
export const createBatchFromGrape = (grapeId, data) => api.post(`/grapes/${grapeId}/vinify`, data);
export const splitBatch = (batchId, data) => api.post(`/batches/${batchId}/split`, data);

// Купажирование
export const blendBatches = (data) => api.post('/batches/blend', data);
