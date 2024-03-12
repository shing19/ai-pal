// Chat.tsx
import React, { useState } from 'react'
import { Message } from 'ai/react'
import { MessageLog } from '@/types/global'

interface ChatProps {
  messages: MessageLog[]
}

const Chat = ({ messages }: ChatProps) => {

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, message: MessageLog) => {
    e.dataTransfer.setData('application/json', JSON.stringify(message));
    console.log('Draging message:', message);
  };

  return (
    <div>
      {messages.map((message: MessageLog) => {
        return (
          <div
            key={message.id}
            draggable
            onDragStart={(e) => handleDragStart(e, message)}
          >
            {message.role === 'assistant' ? <h5>GPT</h5> : <h5>User</h5>}
            {message.createdAt && <p>{new Date(message.createdAt).toLocaleString()}</p>}
            {message.content.split('\n').map((currentTextBlock: string, index: number) => {
              return <p key={message.id + index}>{currentTextBlock}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Chat;