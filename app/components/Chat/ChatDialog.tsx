// Chat.tsx
import React, { useContext, useState } from 'react'
import { Message } from 'ai/react'
import { Button } from "@/components/ui/button"
import { Cross2Icon } from '@radix-ui/react-icons'
import { PalContext } from '../Context/PalContext'

interface ChatDialogProps {
  messages: Message[],
  conversationCreatedAt: Date | undefined
}

const ChatDialog = ({ messages, conversationCreatedAt }: ChatDialogProps) => {
  const { contextMessages, projectConversations, updateConversationCreatedAt, updateContextMessages } = useContext(PalContext);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, message: Message) => {
    e.dataTransfer.setData('application/json', JSON.stringify(message));
  };


  const handleDelete = (messageId: string) => {
    const newMessages = messages.filter(message => message.id !== messageId)
    // 在context里更新
    if (conversationCreatedAt === undefined) {
      updateContextMessages(newMessages)
    } else {
      // 在conversations里更新
      projectConversations.map(conversation => {
        if (conversation.createdAt === conversationCreatedAt) {
          const dialogMessages = conversation.messages.filter(
            (msg) => !conversation.context.includes(msg)
          );
          if (newMessages !== dialogMessages) {
            const newMessagesWithinContext = [...conversation.context, ...newMessages];
            updateConversationCreatedAt(conversationCreatedAt, newMessagesWithinContext)
          }
        }
      })
    }
  };

  return (
    <div>
      {messages?.map((message: Message) => {
        return (
          <div
            key={message.id}
            draggable
            onDragStart={(e) => handleDragStart(e, message)}
          >
            {message.role === 'assistant' ? <h5>GPT</h5> : <h5>User</h5>}
            {message.createdAt && <p>{new Date(message.createdAt).toLocaleString()}</p>}
            {message.content && message.content.split('\n').map((currentTextBlock: string, index: number) => {
              return <p key={message.id + index}>{currentTextBlock}</p>;
            })}
            <Button variant="outline" size="icon" className='h-5 w-5' onClick={() => handleDelete(message.id)}>
              <Cross2Icon className="h-3 w-3" />
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default ChatDialog;