import React, { useState, useRef, useEffect } from 'react';
import Button from '../common/Button';
import './InputBox.css';

function InputBox({ onSend, disabled = false, onStop }) {
    const [text, setText] = useState('');
    const textareaRef = useRef(null);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (text.trim()) {
                onSend(text);
                setText('');
            }
        }
    };

    const handleStopClick = () => {
        if (disabled && onStop) {
            onStop();
        }
    };

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 5 * 24)}px`; // limit to 5 lines
        }
    }, [text]);

    return (
        <form className="input-box" onSubmit={(e) => e.preventDefault()}>
            <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown} // 👈 Important part
                placeholder="Ask something..."
                disabled={disabled}
                rows={1}
                className="input-textarea"
            />
            {disabled ? (
                <Button label="Stop" onClick={handleStopClick} className="stop" />
            ) : (
                <Button label="Send" onClick={() => {
                    if (text.trim()) {
                        onSend(text);
                        setText('');
                    }
                }} />
            )}
        </form>
    );
}

export default InputBox;
