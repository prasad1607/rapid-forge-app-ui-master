// // 📁 src/api/languageApi.js

// // Simulated backend data
// const mockLanguages = [
//   { id: 'java', name: 'Java', versions: ['1.8', '11', '17'] },
//   { id: 'python', name: 'Python', versions: ['3.6', '3.7', '3.9'] },
//   { id: 'javascript', name: 'JavaScript', versions: ['ES5', 'ES6', 'ESNext'] },
//   { id: 'golang', name: 'Golang', versions: ['1.15', '1.16', '1.17'] },
//   { id: 'typescript', name: 'TypeScript', versions: ['3.9', '4.0', '4.5'] },
//   { id: 'ruby', name: 'Ruby', versions: ['2.6', '2.7', '3.0'] },
//   { id: 'csharp', name: 'C#', versions: ['7.0', '8.0', '9.0'] },
// ];

// // API-like methods
// const getTopLanguages = async () => {
//   return mockLanguages.slice(0, 4);
// };

// const searchLanguages = async ({ searchTerm }) => {
//   if (!searchTerm) return [];
//   return mockLanguages.filter(lang =>
//     lang.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );
// };

// const getLanguageById = async ({ id }) => {
//   return mockLanguages.find(lang => lang.id === id) || null;
// };

// const fetchMoreLanguages = async ({ offset = 0, limit = 3 }) => {
//   return mockLanguages.slice(offset, offset + limit);
// };

// const fetchLanguageVersions = async ({ id, offset = 0, limit = 2 }) => {
//   const lang = mockLanguages.find(lang => lang.id === id);
//   return lang ? lang.versions.slice(offset, offset + limit) : [];
// };

// const languageApi = {
//   getTopLanguages,
//   fetchMoreLanguages,
//   searchLanguages,
//   getLanguageById,
//   fetchLanguageVersions
// };

// export default languageApi;


// 📁 src/api/languageApiService.js
import apiClient from '../../lib/apiClient';

const getTopLanguages = async () => {
  const response = await apiClient.get('/languages?page=0');
  console.log('response', response)
  return response.data || []; // Adjust according to backend response structure
};

const fetchMoreLanguages = async ({ offset = 0, limit = 3 }) => {
  const page = Math.floor(offset / limit); // Assuming pagination is by page
  const response = await apiClient.get(`/languages?page=${page}`);
  return response.data.languages || [];
};

const searchLanguages = async ({ searchTerm }) => {
  if (!searchTerm) return [];
  const response = await apiClient.get(`/languages?langName=${searchTerm}`);
  return response.data.languages || [];
};

const getLanguageById = async ({ id }) => {
  const response = await apiClient.get(`/languages/${id}`);
  return response.data || null;
};

// If language versions are part of each language object, extract from there
const fetchLanguageVersions = async ({ id, offset = 0, limit = 2 }) => {
  const response = await apiClient.get(`/languages`);
  const language = (response.data.languages || []).find(lang => lang.id === id);
  return language ? language.versions.slice(offset, offset + limit) : [];
};

const languageApi = {
  getTopLanguages,
  fetchMoreLanguages,
  searchLanguages,
  getLanguageById,
  fetchLanguageVersions
};

export default languageApi;

