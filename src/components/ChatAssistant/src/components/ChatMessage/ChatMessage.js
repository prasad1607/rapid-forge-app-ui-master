import React from 'react';
import './ChatMessage.css';

function ChatMessage({ role, content }) {

  if (!content) return null;

  const isUser = role === 'user';

  return (
    <div className={isUser ? 'chat-message user' : 'chat-message ai'}>
       <div className="chat-message-content">
        {content}
      </div>
    </div>
  );
}

export default ChatMessage;
