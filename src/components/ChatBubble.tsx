import React from 'react';
import { ChatMessage } from '@/types';
import { format } from 'date-fns';

interface ChatBubbleProps {
  message: ChatMessage;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'HH:mm');
    } catch {
      return '';
    }
  };

  return (
    <div className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isUser 
          ? 'bg-primary-600 text-white' 
          : 'bg-gray-200 text-gray-800'
      }`}>
        <div className="break-words whitespace-pre-wrap">
          {message.message}
        </div>
        <div className={`text-xs mt-1 ${
          isUser ? 'text-primary-100' : 'text-gray-500'
        }`}>
          {formatTime(message.created_at)}
        </div>
      </div>
    </div>
  );
};
