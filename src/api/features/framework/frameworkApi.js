import apiClient from '../../lib/apiClient';

export const fetchLanguages = () => apiClient.get('/languages');
export const fetchLanguageById = (id) => apiClient.get(`/products/${id}`);

