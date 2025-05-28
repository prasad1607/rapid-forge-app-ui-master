// // src/api/features/buildTool/buildToolApiService.js

// export const fetchAllBuildTools = async () => {
//     return {
//       Frontend: {
//         NPM: ['9.0.0', '8.5.1', '7.10.0'],
//         Yarn: ['1.22.19', '3.2.0']
//       },
//       Backend: {
//         Maven: ['3.8.4', '3.6.3'],
//         Gradle: ['7.5', '6.9.1']
//       }
//     };
//   };
  
//   export const getBuildToolCategories = (data) => Object.keys(data);
  
//   export const getToolsByCategory = (data, category) =>
//     category && data[category] ? Object.keys(data[category]) : [];
  
//   export const getVersionsForTool = (data, category, tool) =>
//     category && tool && data[category] && data[category][tool]
//       ? data[category][tool]
//       : [];
  

import apiClient from '../../lib/apiClient';

export const fetchAllBuildTools = async (langCode, frameCode, page = 1, size = 10, versionSort = 'desc') => {
  const response = await apiClient.get('/build-tools', {
    params: {
      langCode,
      frameCode,
      page,
      size,
      versionSort
    }
  });
  return response.data; // Expecting structure like: { Frontend: {...}, Backend: {...} }
};

export const getBuildToolCategories = (data) => Object.keys(data);

export const getToolsByCategory = (data, category) =>
  category && data[category] ? Object.keys(data[category]) : [];

export const getVersionsForTool = (data, category, tool) =>
  category && tool && data[category] && data[category][tool]
    ? data[category][tool]
    : [];
