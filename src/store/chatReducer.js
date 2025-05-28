// src/redux/chatReducer.js
const initialState = {
    messages: [],  // Store the chat messages
    isChatOpen: false,  // Flag to manage chat popup state
  };
  
  export const chatReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'ADD_MESSAGE':
        return {
          ...state,
          messages: [...state.messages, action.payload],
        };
      case 'TOGGLE_CHAT':
        return {
          ...state,
          isChatOpen: !state.isChatOpen,
        };
      case 'CLEAR_CHAT':
        return {
          ...state,
          messages: [],
        };
      default:
        return state;
    }
  };
  
  // Actions
  export const addMessage = (message) => ({
    type: 'ADD_MESSAGE',
    payload: message,
  });
  
  export const toggleChat = () => ({
    type: 'TOGGLE_CHAT',
  });
  
  export const clearChat = () => ({
    type: 'CLEAR_CHAT',
  });
  