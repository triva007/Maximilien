import React, { useState, useEffect } from 'react';
import type { Message } from '../types';
import MaxAvatar from './icons/MaxAvatar';

interface ChatMessageProps {
  message: Message;
}

const TypingIndicator: React.FC = () => (
  <div className="flex items-center space-x-1 p-1">
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
  </div>
);

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [isVisible, setIsVisible] = useState(false);
  const isModel = message.role === 'model';
  const text = message.parts[0]?.text ?? '';
  
  useEffect(() => {
    // Trigger animation shortly after mount
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`flex items-start gap-3 transition-all duration-500 ease-out ${isModel ? 'justify-start' : 'justify-end'} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      {isModel && <MaxAvatar />}
      <div
        className={`max-w-md lg:max-w-2xl px-4 py-3 rounded-2xl shadow-lg ${
          isModel
            ? 'bg-gray-700/80 text-gray-100 rounded-tl-none ring-1 ring-white/10'
            : 'bg-blue-600 text-white rounded-br-none'
        }`}
      >
        {text === '...' ? <TypingIndicator /> : <p className="whitespace-pre-wrap">{text}</p>}
      </div>
    </div>
  );
};

export default ChatMessage;