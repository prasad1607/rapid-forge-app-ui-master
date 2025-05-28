/**
 * Format date to readable string
 * @param {Date} date 
 * @returns {String} Formatted date string
 */
export const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  /**
   * Generate a unique identifier
   * @returns {String} Unique ID
   */
  export const generateId = () => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  };
  
  /**
   * Validate project name format
   * @param {String} name 
   * @returns {Boolean} Is valid
   */
  export const isValidProjectName = (name) => {
    // Project name should be alphanumeric with hyphens or underscores
    const regex = /^[a-zA-Z0-9-_]+$/;
    return regex.test(name);
  };
  
  /**
   * Convert bytes to readable file size
   * @param {Number} bytes 
   * @returns {String} Human-readable file size
   */
  export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  /**
   * Get appropriate build commands for selected language
   * @param {String} language 
   * @param {String} buildTool 
   * @returns {Object} Build commands
   */
  export const getBuildCommands = (language, buildTool) => {
    const commands = {
      java: {
        maven: {
          build: 'mvn clean install',
          run: 'mvn spring-boot:run',
          test: 'mvn test'
        },
        gradle: {
          build: 'gradle build',
          run: 'gradle bootRun',
          test: 'gradle test'
        }
      },
      python: {
        pip: {
          build: 'pip install -e .',
          run: 'python app.py',
          test: 'pytest'
        },
        poetry: {
          build: 'poetry install',
          run: 'poetry run python app.py',
          test: 'poetry run pytest'
        }
      },
      javascript: {
        npm: {
          build: 'npm install && npm run build',
          run: 'npm start',
          test: 'npm test'
        },
        yarn: {
          build: 'yarn install && yarn build',
          run: 'yarn start',
          test: 'yarn test'
        }
      }
    };
    
    return commands[language]?.[buildTool] || {
      build: '',
      run: '',
      test: ''
    };
  };
  
  /**
   * Debounce function for inputs
   * @param {Function} func 
   * @param {Number} wait 
   * @returns {Function} Debounced function
   */
  export const debounce = (func, wait) => {
    let timeout;
    
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
  