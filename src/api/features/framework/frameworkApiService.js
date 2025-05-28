// // 📁 src/api/languageApi.js

// // Simulated backend data
// const mockFrameworks = [
//   {
//     id: 'springboot',
//     name: 'Spring Boot',
//     language: 'java',
//     versions: ['2.3', '2.4', '2.5', '2.6', '2.7', '3.0', '3.1', '3.2']
//   },
//   {
//     id: 'micronaut',
//     name: 'Micronaut',
//     language: 'java',
//     versions: ['2.0', '2.1', '3.0']
//   },
//   {
//     id: 'flask',
//     name: 'Flask',
//     language: 'python',
//     versions: ['0.12', '1.0', '1.1', '2.0', '2.1', '2.2']
//   },
//   {
//     id: 'django',
//     name: 'Django',
//     language: 'python',
//     versions: ['2.2', '3.0', '3.2', '4.0', '4.1', '4.2']
//   },
//   {
//     id: 'react',
//     name: 'React',
//     language: 'javascript',
//     versions: ['15', '16', '17', '18']
//   },
//   {
//     id: 'vue',
//     name: 'Vue',
//     language: 'javascript',
//     versions: ['2.5', '2.6', '3.0', '3.2']
//   },
//   {
//     id: 'angular',
//     name: 'Angular',
//     language: 'typescript',
//     versions: ['11', '12', '13', '14', '15']
//   },
//   {
//     id: 'express',
//     name: 'Express',
//     language: 'javascript',
//     versions: ['4.16', '4.17', '4.18']
//   }
// ];

// // API-like methods

// const getTopFrameworks = async () => {
//   return mockFrameworks.slice(0, 3);
// };

// const searchFramework = async ({ searchTerm }) => {
//   if (!searchTerm) return [];
//   return mockFrameworks.filter(fw =>
//     fw.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );
// };

// const getFrameworkByLanguage = async ( language ) => {
//   if (language===null||!language) return [];
//   return mockFrameworks.filter(fw => fw.language === language);
// };

// const fetchMoreFrameworks = async ({ offset = 0, limit = 3 }) => {
//   return mockFrameworks.slice(offset, offset + limit);
// };

// const fetchFrameworkVersions = async ({ id, offset = 0, limit = 3 }) => {
//   const fw = mockFrameworks.find(f => f.id === id);
//   return fw ? fw.versions.slice(offset, offset + limit) : [];
// };

// const getFrameworkById = async ({ id }) => {
//   return mockFrameworks.find(f => f.id === id) || null;
// };

// const frameworkApi = {
//   getTopFrameworks,
//   fetchMoreFrameworks,
//   searchFramework,
//   getFrameworkByLanguage,
//   fetchFrameworkVersions,
//   getFrameworkById
// };

// export default frameworkApi;


// 📁 src/api/features/framework/frameworkApiService.js
import apiClient from '../../lib/apiClient';

export const getFrameworksByLanguage = async ({ langCode, page = 1, size = 5, versionSortBy = 'createdAt', versionSortOrder = 'desc' }) => {
  const response = await apiClient.get('/frameworks', {
    params: {
      langCode,
      page,
      size,
      versionSortBy,
      versionSortOrder,
    },
  });

  return response.data || { frameworks: [], total: 0 };
};

export const fetchFrameworkVersions = async ({ id, offset = 0, limit = 3 }) => {
  const response = await apiClient.get(`/frameworks/${id}/versions`, {
    params: { offset, limit },
  });

  return response.data || [];
};
