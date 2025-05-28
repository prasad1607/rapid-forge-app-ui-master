// // dependencyService.js

import apiClient from "../../lib/apiClient";

// const mockDependencies = {
//     'Web': [
//       { name: 'Spring Web', versions: ['2.7', '3.0'] },
//       { name: 'Flask', versions: ['2.0', '2.1'] },
//       { name: 'React Router', versions: ['6', '6.4'] }
//     ],
//     'Data': [
//       { name: 'Spring Data JPA', versions: ['2.7', '3.0'] },
//       { name: 'SQLAlchemy', versions: ['1.4', '2.0'] }
//     ],
//     'Security': [
//       { name: 'Spring Security', versions: ['5.7', '6.0'] },
//       { name: 'Flask-Login', versions: ['0.5.0', '0.6.0'] }
//     ],
//     'State Management': [
//       { name: 'Redux', versions: ['4.0', '5.0'] }
//     ]
//   };
  
//   // Simulate async fetching
//   export const fetchAllDependencies = () => {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve(mockDependencies);
//       }, 300);
//     });
//   };
  
//   // Get all categories from mock data
//   export const getCategories = () => {
//     return Object.keys(mockDependencies);
//   };
  
//   // Get dependencies by category from mock data
//   export const getDependenciesByCategory = (category) => {
//     return category && mockDependencies[category] ? mockDependencies[category] : [];
//   };
  
//   // Search all dependencies in mock data
//   export const searchDependencies = (searchTerm) => {
//     const all = Object.values(mockDependencies).flat();
//     return all.filter(dep => dep.name.toLowerCase().includes(searchTerm.toLowerCase()));
//   };
  
//   // Get versions for a specific dependency from mock data
//   export const getVersionsForDependency = (depName) => {
//     const all = Object.values(mockDependencies).flat();
//     return all.find(dep => dep.name === depName)?.versions || [];
//   };
  

// src/api/features/dependency/dependencyApiService.js
// ✅ correct relative path

/**
 * Fetch dependencies from backend API.
 * @param {string} langCode - e.g. 'LANG_JAVA'
 * @param {string} frameCode - e.g. 'FRAME_SPRING'
//  * @param {string} [buildToolsName] - optional (e.g. 'MAVEN')
 * @param {number} [page=1]
 * @param {number} [size=10]
 */
export const fetchDependencies = async (langCode, frameCode, page = 1, size = 10) => {
  try {
    const response = await apiClient.get('/dependencies', {
      params: {
        langCode,
        frameCode,
        // buildToolsName,
        page,
        size,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching dependencies from API:', error);
    throw error;
  }
};

