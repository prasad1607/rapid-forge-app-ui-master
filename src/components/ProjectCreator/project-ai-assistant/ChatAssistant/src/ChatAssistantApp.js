import React from 'react';
import ChatBox from './components/ChatBox/ChatBox';
import './ChatAssistantApp.css';

function ChatAssistantApp({ currentStep, projectData,steps }) {
  return (
    <div>
      <ChatBox
        currentStep={currentStep}
        projectData={projectData}
        steps={steps}
         />
    </div>
  );
}

export default ChatAssistantApp;
