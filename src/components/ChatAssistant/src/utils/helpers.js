export function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  export function isValidMessage(text) {
    return typeof text === 'string' && text.trim().length > 0;
  }
  