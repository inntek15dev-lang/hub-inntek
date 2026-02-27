import axios from 'axios';

const API_BASE = import.meta.env.PROD
    ? 'https://hub-inntek-api.onrender.com/api'
    : 'http://localhost:4010/api';

const api = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' },
});

// ── Categories ─────────────────────────────────────────────────────────
export const getCategories = () => api.get('/categories').then(r => r.data);
export const getCategoryById = (id) => api.get(`/categories/${id}`).then(r => r.data);
export const createCategory = (data) => api.post('/categories', data).then(r => r.data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data).then(r => r.data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`).then(r => r.data);

// ── Catalog Elements ───────────────────────────────────────────────────
export const getCatalogItems = () => api.get('/catalog').then(r => r.data);
export const getCatalogItemById = (id) => api.get(`/catalog/${id}`).then(r => r.data);
export const createCatalogItem = (data) => api.post('/catalog', data).then(r => r.data);
export const updateCatalogItem = (id, data) => api.put(`/catalog/${id}`, data).then(r => r.data);
export const deleteCatalogItem = (id) => api.delete(`/catalog/${id}`).then(r => r.data);

export default api;
