
import React from 'react';
import type { Message } from '../types';
import MaxAvatar from './icons/MaxAvatar';

interface ChatMessageProps {
  message: Message;
}

const TypingIndicator: React.FC = () => (
  <div className="flex items-center space-x-1">
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
  </div>
);

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === 'model';
  const text = message.parts[0].text;

  return (
    <div className={`flex items-start gap-3 ${isModel ? 'justify-start' : 'justify-end'}`}>
      {isModel && <MaxAvatar />}
      <div
        className={`max-w-md lg:max-w-2xl px-4 py-3 rounded-2xl ${
          isModel
            ? 'bg-gray-700 text-gray-100 rounded-tl-none'
            : 'bg-blue-600 text-white rounded-br-none'
        }`}
      >
        {text === '...' ? <TypingIndicator /> : <p className="whitespace-pre-wrap">{text}</p>}
      </div>
    </div>
  );
};

export default ChatMessage;
