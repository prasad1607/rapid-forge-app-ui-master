import React, { useState, useRef, useEffect } from 'react';
import './ChatBox.css';

import { sendMessage, abortMessage } from '../../api/chatService';
import ChatMessage from '../ChatMessage/ChatMessage';
import InputBox from '../InputBox/InputBox';
import Button from '../common/Button';
import { toggleTheme } from '../../utils/theme-toggle';
import Loader from '../common/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '../../../../../store/chatReducer'; // Adjust the import path as necessary


function ChatBox() {
    const storedMessages = useSelector((state) => state.chat.messages); // Get messages from Redux state
    const [messages, setMessages] = useState(storedMessages);
    const [isStreaming, setIsStreaming] = useState(false);
    const [isUserAtBottom, setIsUserAtBottom] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();


    const messageEndRef = useRef(null);
    const chatMessagesRef = useRef(null);

    const handleSend = async (userInput) => {
        if (!userInput.trim()) return;

        const userMessage = { role: 'user', content: userInput };
        setMessages(prev => [...prev, userMessage]);
        setMessages(prev => [...prev, { role: 'ai', content: '' }]);
        setIsLoading(true);
        setIsStreaming(true);

        let aiResponse = '';
        let isFirstChunk = true;

        try {
            await sendMessage(userInput, (chunk) => {
                aiResponse += chunk;
                if (isFirstChunk) {
                    setIsLoading(false);
                    isFirstChunk = false;
                }
                setMessages(prev =>
                    prev.map((msg, idx) =>
                        idx === prev.length - 1 ? { ...msg, content: aiResponse } : msg
                    )
                );
            });
            dispatch(addMessage(userMessage));
            dispatch(addMessage({ role: 'ai', content: aiResponse })); 
        } catch (err) {
            console.log('Stream aborted or failed:', err.message);
        } finally {
            setIsStreaming(false);
        }
    };

    const handleStop = () => {
        abortMessage();
        setIsLoading(false);
        setIsStreaming(false);
    };

    const handleScroll = () => {
        const container = chatMessagesRef.current;
        if (!container) return;

        const { scrollTop, scrollHeight, clientHeight } = container;
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
        setIsUserAtBottom(isAtBottom);
    };

    useEffect(() => {
        if (isUserAtBottom) {
            messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <div className="chat-wrapper">
            <div className="chat-container">
                <div className="system-message">
                    Welcome to Rapid forge
                    <button onClick={toggleTheme} className="theme-toggle-btn small">
                        change Theme
                    </button>
                </div>

                <div
                    className="chat-messages"
                    ref={chatMessagesRef}
                    onScroll={handleScroll}
                >
                    {messages.map((msg, idx) => (
                        <ChatMessage key={idx} role={msg.role} content={msg.content} />
                    ))}
                    {isLoading && (
                        <div className="ai-typing-indicator">
                            <Loader />
                        </div>
                    )}
                    <div ref={messageEndRef} />
                </div>

                <div className="chat-input-row">
                    <InputBox
                        onSend={handleSend}
                        disabled={isStreaming}
                        onStop={handleStop}
                    />
                </div>
            </div>
        </div>
    );
}

export default ChatBox;
