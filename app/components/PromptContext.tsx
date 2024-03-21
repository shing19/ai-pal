// PromptContext.tsx
import React, { use, useContext, useEffect, useState } from 'react';
import { PalContext } from './Context/PalContext';
import { useChat, Message } from 'ai/react'
import ChatInput from './Chat/ChatInput'
import ChatDialog from './Chat/ChatDialog';


const PromptContext = () => {
    const { contextMessages, addContextMessage, projectConversations, updateConversationCreatedAt, addProjectConversation } = useContext(PalContext);
    const { input, handleInputChange, handleSubmit, isLoading, messages, setMessages } = useChat()
    const [newConversation, setNewConversation] = useState<boolean>(false)
    const [thisMessages, setThisMessages] = useState<Message[]>([])
    const [thisConversationCreatedAt, setThisConversationCreatedAt] = useState<Date>()


    // 拖拽更新 context messages
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const transferMessage = e.dataTransfer.getData('application/json');
        const droppedMessage = transferMessage ? JSON.parse(transferMessage) : null;
        // 如果消息存在且不在当前消息列表中,则更新消息列表
        if (droppedMessage && !contextMessages.find(m => m.id === droppedMessage.id)) {
            addContextMessage([droppedMessage]);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    // 处理新对话
    const handleSubmitExtended = (e: React.FormEvent<HTMLFormElement>) => {
        setThisMessages([])
        const previousMessages = messages
        const newMessages = [...contextMessages, ...messages.filter(m => !previousMessages.includes(m))];
        setMessages(newMessages);
        handleSubmit(e);
        setNewConversation(true)
        setThisConversationCreatedAt(new Date())
    }

    // messages不变也会一直刷新，所以要过滤一下，避免陷入死循环
    useEffect(() => {
        if ((messages !== thisMessages)) {
            setThisMessages(messages)
        }
    }, [messages])

    useEffect(() => {
        // 判断是否是新对话，查看projectConversations里是否有latestConversationCreatedAt
        function ConversationExists() {
            return projectConversations.some(conversation => conversation.createdAt === thisConversationCreatedAt)
        }

        // 如果不存在对话，且是新对话，且消息长度为2，则创建新对话
        if (!(ConversationExists()) && newConversation && thisConversationCreatedAt && ((thisMessages.length - contextMessages.length == 1))) {
            const newConversation = {
                context: contextMessages,
                messages: thisMessages,
                createdAt: thisConversationCreatedAt,
            }
            addProjectConversation([newConversation])
            // 重置状态
            setNewConversation(false)
        }

        // 如果存在对话，则更新对话
        if (ConversationExists() && thisConversationCreatedAt) {
            updateConversationCreatedAt(thisConversationCreatedAt, thisMessages)
        }
    }, [thisMessages, isLoading, thisConversationCreatedAt])


    return (
        <div className='h-full'>
            <div className='flex flex-col h-5/6'
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <div>PromptContext Component</div>
                <ChatDialog
                    messages={contextMessages}
                    conversationCreatedAt={undefined}
                />
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