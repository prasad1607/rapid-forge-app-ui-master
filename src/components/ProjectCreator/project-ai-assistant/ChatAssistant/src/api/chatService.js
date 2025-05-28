// src/api/chatService.js

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:11434/api/generate';
const DIRECT_LLM_API_URL = 'http://localhost:11434/api/generate';

const url = new URL(API_URL);

let abortController = null; // shared reference


export function abortMessage() {
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
  }
  
  export async function sendMessage1(message, onStream = null) {
    abortController = new AbortController();
    console.log('Sending message:')
    url.searchParams.set('userMessage', message);
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: abortController.signal,
    });
  
    if (!response.ok) throw new Error('Failed to send message');
  
    if (onStream) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullMessage = '';
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
  
        buffer += decoder.decode(value, { stream: true });
  
        const lines = buffer.split('\n');
        buffer = lines.pop(); // carry over incomplete line
  
        for (const line of lines) {
          
              try {
                const parsed = JSON.parse(line);
                if (parsed.response) {
                  fullMessage += parsed.response;
                  onStream(parsed.response); // stream piece
                  console.log('Streamed response:', parsed.response);
                }
              } catch (err) {
                console.error('Stream parse error:', err);
              }
            
          
        }
      }
  
      return fullMessage;
    } else {
      const result = await response.json();
      return result.response;
    }
  }

export async function sendMessage(message, onStream = null) {
  abortController = new AbortController();
  console.log('Sending message:')
  const response = await fetch(DIRECT_LLM_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'mistral',
      prompt: message,
      stream: Boolean(onStream),
    }),
    signal: abortController.signal,
  });

  if (!response.ok) throw new Error('Failed to send message');

  if (onStream) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullMessage = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      buffer = lines.pop(); // carry over incomplete line

      for (const line of lines) {
        
            try {
              const parsed = JSON.parse(line);
              if (parsed.response) {
                fullMessage += parsed.response;
                onStream(parsed.response); // stream piece
                console.log('Streamed response:', parsed.response);
              }
            } catch (err) {
              console.error('Stream parse error:', err);
            }
          
        
      }
    }

    return fullMessage;
  } else {
    const result = await response.json();
    return result.response;
  }
}
