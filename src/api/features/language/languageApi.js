import apiClient from '../../lib/apiClient';

export const fetchLanguages = () => apiClient.get('/languages');
export const fetchLanguageById = (id) => apiClient.get(`/products/${id}`);


// import apiClient from './apiClient'; // Adjust path if needed

// const JAVA_BACKEND_BASE_URL = 'http://localhost:8080/api/languages';

// const getTopLanguages = async () => {
//   try {
//     const response = await apiClient.get(`${JAVA_BACKEND_BASE_URL}`, {
//       params: { page: 0 },
//       headers: { Accept: 'application/json' },
//     });
//     console.log('getTopLanguages response:', JSON.stringify(response.data, null, 2));
//     return response.data.languages || [];
//   } catch (error) {
//     console.error('Error in getTopLanguages:', error.message);
//     return [];
//   }
// };

// const fetchMoreLanguages = async ({ offset = 0, limit = 3 }) => {
//   try {
//     const page = Math.floor(offset / limit);
//     const response = await apiClient.get(`${JAVA_BACKEND_BASE_URL}`, {
//       params: { page },
//       headers: { Accept: 'application/json' },
//     });
//     console.log('fetchMoreLanguages response:', JSON.stringify(response.data, null, 2));
//     return response.data.languages || [];
//   } catch (error) {
//     console.error('Error in fetchMoreLanguages:', error.message);
//     return [];
//   }
// };

// const searchLanguages = async ({ searchTerm }) => {
//   if (!searchTerm) return [];
//   try {
//     const response = await apiClient.get(`${JAVA_BACKEND_BASE_URL}`, {
//       params: { langName: searchTerm },
//       headers: { Accept: 'application/json' },
//     });
//     console.log('searchLanguages response:', JSON.stringify(response.data, null, 2));
//     return response.data.languages || [];
//   } catch (error) {
//     console.error('Error in searchLanguages:', error.message);
//     return [];
//   }
// };

// const getLanguageById = async ({ id }) => {
//   try {
//     // Your Java backend does not provide /languages/{id} endpoint,
//     // so fetch all and filter client-side:
//     const response = await apiClient.get(`${JAVA_BACKEND_BASE_URL}`, {
//       headers: { Accept: 'application/json' },
//     });
//     console.log('getLanguageById response:', JSON.stringify(response.data, null, 2));
//     const languages = response.data.languages || [];
//     return languages.find(lang => String(lang.id) === String(id)) || null;
//   } catch (error) {
//     console.error('Error in getLanguageById:', error.message);
//     return null;
//   }
// };

// const fetchLanguageVersions = async ({ id, offset = 0, limit = 2 }) => {
//   try {
//     const language = await getLanguageById({ id });
//     if (!language) return [];
//     return language.versions.slice(offset, offset + limit);
//   } catch (error) {
//     console.error('Error in fetchLanguageVersions:', error.message);
//     return [];
//   }
// };

// const incrementUsage = async (id) => {
//   try {
//     await apiClient.put(`${JAVA_BACKEND_BASE_URL}/${id}/incrementUsage`, null, {
//       headers: { Accept: 'application/json' },
//     });
//     return true;
//   } catch (error) {
//     console.error('Error in incrementUsage:', error.message);
//     return false;
//   }
// };

// const addLanguage = async (languageRequest) => {
//   try {
//     const response = await apiClient.post(`${JAVA_BACKEND_BASE_URL}`, languageRequest, {
//       headers: { Accept: 'application/json' },
//     });
//     console.log('addLanguage response:', JSON.stringify(response.data, null, 2));
//     return response.data || null;
//   } catch (error) {
//     console.error('Error in addLanguage:', error.message);
//     return null;
//   }
// };

// const languageApi = {
//   getTopLanguages,
//   fetchMoreLanguages,
//   searchLanguages,
//   getLanguageById,
//   fetchLanguageVersions,
//   incrementUsage,
//   addLanguage,
// };

// export default languageApi;
