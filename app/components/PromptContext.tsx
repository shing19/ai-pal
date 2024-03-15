// Context.tsx
import React, { useContext, useEffect, useState } from 'react';
import { PalContext } from './PalContext';
import { useChat, Message } from 'ai/react'
import Chat from './Chat';
import ChatInput from './ChatInput'


const PromptContext = () => {
    const { contextMessages, updateContextMessages, projectConversations, updateProjectConversations } = useContext(PalContext);
    const { input, handleInputChange, handleSubmit, isLoading, messages, setMessages } = useChat()


    // 拖拽更新 context messages
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const transferMessage = e.dataTransfer.getData('application/json');
        const droppedMessage = transferMessage ? JSON.parse(transferMessage) : null;
        // 如果消息存在且不在当前消息列表中,则更新消息列表
        if (droppedMessage && !contextMessages.find(m => m.id === droppedMessage.id)) {
            updateContextMessages([droppedMessage]);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };


    // 处理新对话
    // 1. 补充 contextMessages
    useEffect(() => {
        setMessages(contextMessages)
    }, [setMessages, contextMessages]);
    // 2. 提交 form 时更新 projectConversations
    useEffect(() => {
        if (messages !== contextMessages) {
            const newConversations = {
                context: contextMessages,
                createdAt: Date.now(),
                messages: messages
            }
            updateProjectConversations([newConversations]);
        }
    }, [messages, contextMessages, updateProjectConversations]);


    return (
        <div className='h-full'>
            <div className='flex flex-col h-5/6'
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <div>PromptContext Component</div>
                <Chat messages={contextMessages} />
                <ChatInput
                    input={input}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                    messages={messages} />
            </div>
        </div>
    );
};

export default PromptContext;