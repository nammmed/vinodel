// src/services/api.js

import axios from 'axios';

const api = axios.create({
    baseURL: '/server',
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
export const getBatchDetails = (id) => api.get(`/batches/${id}/details`);

// Купажирование
export const blendBatches = (data) => api.post('/batches/blend', data);

// Рецепты
export const getRecipes = () => api.get('/recipes');
export const getRecipeById = (id) => api.get(`/recipes/${id}`);
export const getAssemblyPlan = (recipeId, targetVolume) => api.post(`/recipes/${recipeId}/get-plan`, { targetVolume });

// Расходники (Склад)
export const getSupplies = () => api.get('/supplies');
export const createSupply = (data) => api.post('/supplies', data);
export const addStockToSupply = (supplyId, data) => api.post(`/supplies/${supplyId}/add-stock`, data);

// Розлив
export const getBottlingPlan = (batchId, volume, bottleId) => api.get(`/batches/${batchId}/bottling-plan`, { params: { volume, bottle_id: bottleId } });
export const executeBottling = (batchId, data) => api.post(`/batches/${batchId}/execute-bottling`, data);
