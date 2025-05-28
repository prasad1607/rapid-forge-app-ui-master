import React from 'react';
import './ProjectTemplates.css';

const ProjectTemplates = () => {
  const templatesList = [
    {
      language: {
        id: 'javascript',
        name: 'JavaScript',
        color: '#facc15',
        versions: ['ES5', 'ES6', 'ESNext'],
      },
      framework: 'Express',
      frameworkObject: {
        name: 'Express',
        language: 'javascript',
        versions: ['4.17', '5.0'],
      },
      frameworkVersion: '4.17',
      projectName: 'express-api',
      groupId: 'com.example.api',
      artifactId: 'express-api',
      author: 'abhi',
      description: 'Sample Express.js project',
      version: 'ES6',
      buildTool: 'npm',
      buildToolVersion: '8.0',
      dependencies: [
        { name: 'express', version: '4.17.1' },
        { name: 'cors', version: '2.8.5' },
      ],
      plugins: [{ name: 'ESLint', version: '8.0' }],
      pipelines: ['GitHub Actions'],
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png',
    },
    {
      language: {
        id: 'python',
        name: 'Python',
        color: '#4B8BBE',
        versions: ['3.8', '3.9', '3.10'],
      },
      framework: 'Django',
      frameworkObject: {
        name: 'Django',
        language: 'python',
        versions: ['3.2', '4.0', '4.1'],
      },
      frameworkVersion: '4.1',
      projectName: 'django_app',
      groupId: 'com.example.web',
      artifactId: 'django-app',
      author: 'abhi',
      description: 'Sample Django project',
      version: '3.9',
      buildTool: 'pip',
      buildToolVersion: '22.0',
      dependencies: [
        { name: 'Django', version: '4.1' },
        { name: 'djangorestframework', version: '3.13' },
      ],
      plugins: [{ name: 'Black Formatter', version: '22.3' }],
      pipelines: ['CircleCI'],
      imageUrl: 'https://static.djangoproject.com/img/logos/django-logo-negative.svg',
    },
    {
      language: {
        id: 'javascript',
        name: 'JavaScript',
        color: '#60a5fa',
        versions: ['ES6', 'ESNext'],
      },
      framework: 'React',
      frameworkObject: {
        name: 'React',
        language: 'javascript',
        versions: ['17', '18'],
      },
      frameworkVersion: '18',
      projectName: 'react-dashboard',
      groupId: 'com.example.frontend',
      artifactId: 'react-dashboard',
      author: 'abhi',
      description: 'React dashboard project',
      version: 'ESNext',
      buildTool: 'npm',
      buildToolVersion: '8.0',
      dependencies: [
        { name: 'react-router-dom', version: '6.0' },
        { name: 'axios', version: '0.26' },
      ],
      plugins: [{ name: 'Prettier', version: '2.6' }],
      pipelines: ['Vercel'],
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
    },
    {
      language: {
        id: 'go',
        name: 'Go',
        color: '#00ADD8',
        versions: ['1.17', '1.18', '1.19'],
      },
      framework: 'Gin',
      frameworkObject: {
        name: 'Gin',
        language: 'go',
        versions: ['1.7', '1.8'],
      },
      frameworkVersion: '1.8',
      projectName: 'gin-api',
      groupId: 'com.example.backend',
      artifactId: 'gin-api',
      author: 'abhi',
      description: 'Gin based Go REST API',
      version: '1.18',
      buildTool: 'go mod',
      buildToolVersion: '1.18',
      dependencies: [{ name: 'gin-gonic/gin', version: 'v1.8.1' }],
      plugins: [],
      pipelines: ['GitHub Actions'],
      imageUrl: 'https://raw.githubusercontent.com/gin-gonic/logo/master/color.png',
    },
    {
      language: {
        id: 'rust',
        name: 'Rust',
        color: '#dea584',
        versions: ['1.60', '1.65'],
      },
      framework: 'Rocket',
      frameworkObject: {
        name: 'Rocket',
        language: 'rust',
        versions: ['0.5'],
      },
      frameworkVersion: '0.5',
      projectName: 'rocket-api',
      groupId: 'com.example.rust',
      artifactId: 'rocket-api',
      author: 'abhi',
      description: 'Rocket based web service',
      version: '1.65',
      buildTool: 'cargo',
      buildToolVersion: '1.65',
      dependencies: [{ name: 'rocket', version: '0.5.0-rc.2' }],
      plugins: [],
      pipelines: ['GitLab CI'],
      imageUrl: 'https://media.istockphoto.com/id/1401433457/photo/rocket-launch-digital-business-startup.jpg?s=1024x1024&w=is&k=20&c=nuMhEtJO3cIeHgVHEUSqDosVG5NmkR1pqVJvl2bXSbw=',
    },
  ];

  const handleSelectTemplate = (template) => {
    console.log('User selected template:', template);
  };

  return (
    <div className="templates-container">
      <h2>Choose a Project Template</h2>
      <div className="templates-grid">
        {templatesList.map((template, idx) => (
          <div
            key={idx}
            className="template-card"
            onClick={() => handleSelectTemplate(template)}
          >
            <img
              src={template.imageUrl}
              alt={template.framework}
              className="template-image"
            />
            <div className="template-content">
              <h3>{template.projectName}</h3>
              <p className="template-description">{template.description}</p>
              <div className="template-tags">
                <span style={{ backgroundColor: template.language.color }}>
                  {template.language.name}
                </span>
                <span>{template.framework}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectTemplates;
