import { ConversationWithinContext } from '@/types/global';
import React, { use, useContext, useEffect, useState } from 'react'
import Chat from './Chat';
import ChatInput from './ChatInput';
import { Message, useChat } from 'ai/react';
import { PalContext } from './PalContext';


interface ConversationProps {
    conversation: ConversationWithinContext;
}


const Conversation = ({ conversation }: ConversationProps) => {
    const { projectConversations, updateProjectConversations } = useContext(PalContext);
    const { input, handleInputChange, handleSubmit, isLoading, messages, setMessages } = useChat();
    const filteredMessages = conversation.messages.filter(
        (msg) => !conversation.context.includes(msg)
    );
    const [thisMessages, setThisMessages] = useState<Message[]>(filteredMessages);

    // 对话更新到 project 里
    useEffect(() => {
        const newMessages = [...filteredMessages, ...messages]
        if (messages !== thisMessages) {
            setThisMessages(newMessages);
        }
    }, [messages]);

    useEffect(() => {
        if (!isLoading && thisMessages.length > 0) {
            const updatedConversations = projectConversations.map((c) => {
                if (c.createdAt == conversation.createdAt) {
                    if (c.messages !== thisMessages) {
                        return {
                            ...c,
                            messages: thisMessages,
                        };
                    }
                }
                return c;
            })
            // debug: 查看准备更新到环境里的对话
            // console.log('updatedConversations', updatedConversations)
            if (updatedConversations !== projectConversations) {
                updateProjectConversations(updatedConversations);
            }
        }
    }, [thisMessages, isLoading]);

    return (
        <div>
            <Chat messages={thisMessages} />
            <ChatInput
                input={input}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                messages={messages} />
        </div>
    )
}

export default Conversation