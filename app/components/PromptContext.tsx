// Context.tsx
import React, { use, useContext, useEffect, useState } from 'react';
import { PalContext } from './PalContext';
import { useChat, Message } from 'ai/react'
import Chat from './Chat';
import ChatInput from './ChatInput'


const PromptContext = () => {
    const { contextMessages, updateContextMessages, projectConversations, updateProjectConversations } = useContext(PalContext);
    const { input, handleInputChange, handleSubmit, isLoading, messages, setMessages } = useChat()
    const [ newConversation , setNewConversation ] = useState<boolean>(false)
    const [ thisMessages, setThisMessages ] = useState<Message[]>([])


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
    const handleSubmitExtended = (e: React.FormEvent<HTMLFormElement>) => {
        setMessages([...contextMessages, ...messages]);
        handleSubmit(e);
        setNewConversation(true)
    }

    useEffect(() => {
        if ((messages !== thisMessages)) {
            setThisMessages(messages)
        }
    }, [messages, thisMessages, setThisMessages, newConversation])

    useEffect(() => {
        if ( !isLoading && newConversation && ((thisMessages.length - contextMessages.length == 2))) {
            const newConversations = {
                context: contextMessages,
                messages: thisMessages,
                createdAt: new Date(),
            }
            updateProjectConversations([newConversations])
            // 重置状态
            setMessages([]) 
            setThisMessages([])
            setNewConversation(false)
        }
    }, [thisMessages, isLoading])


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
                    handleSubmit={handleSubmitExtended}
                    isLoading={isLoading}
                    messages={messages} />
            </div>
        </div>
    );
};

export default PromptContext;