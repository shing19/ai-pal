// PalContext.js
import React, { createContext, useState } from 'react';
import { ConversationWithinContext } from "@/types/global"
import { Message } from 'ai/react'

interface PalContextValue {
    contextMessages: Message[];
    projectConversations: ConversationWithinContext[],
    addContextMessage: (newMessages: Message[]) => void;
    updateContextMessages: (updatedMessages: Message[]) => void;
    addProjectConversation: (newMessages: ConversationWithinContext[]) => void;
    updateProjectConversations: (updatedConversations: ConversationWithinContext[]) => void;
    updateConversationCreatedAt: (createdAt: Date, updatedMessages: Message[]) => void;
}

export const PalContext = createContext<PalContextValue>({
    contextMessages: [],
    projectConversations: [],
    addContextMessage: () => { },
    updateContextMessages: () => { },
    addProjectConversation: () => { },
    updateProjectConversations: () => { },
    updateConversationCreatedAt: () => { },
});

// @ts-ignore
export const PalProvider = ({ children }) => {

    const [contextMessages, setContextMessages] = useState<Message[]>([]);
    const [projectConversations, setProjectConversations] = useState<ConversationWithinContext[]>([]);

    const addContextMessage = (newMessages: Message[]) => {
        setContextMessages((prevMessages) => [...prevMessages, ...newMessages]);
    }

    const updateContextMessages = (updatedMessages: Message[]) => {
        setContextMessages(updatedMessages);
    }

    const addProjectConversation = (newConversation: ConversationWithinContext[]) => {
        setProjectConversations((prevConversations) => [...prevConversations, ...newConversation]);
    }

    const updateProjectConversations = (updatedConversations: ConversationWithinContext[]) => {
        setProjectConversations(updatedConversations);
    }

    const updateConversationCreatedAt = (createdAt: Date, updatedMessages: Message[]) => {
        // 去重加入流式更新的新消息
        const updatedConversations = projectConversations.map(conversation => {
            if (conversation.createdAt === createdAt) {
                let updatedMessagesList = conversation.messages.map(message => ({ ...message }));
                updatedMessages.forEach(newMessage => {
                    const existingMessageIndex = updatedMessagesList.findIndex(
                        message => message.id === newMessage.id
                    );
                    if (existingMessageIndex !== -1) {
                        const existingMessage = updatedMessagesList[existingMessageIndex];
                        if (existingMessage.content !== newMessage.content) {
                            // 如果内容不同，则替换消息
                            updatedMessagesList[existingMessageIndex] = newMessage;
                        }
                    } else {
                        // 如果没有找到具有相同 id 的消息，则添加新消息到会话消息数组中
                        updatedMessagesList.push(newMessage);
                    }
                });
                return {
                    ...conversation,
                    messages: updatedMessagesList,
                };
            }
            return conversation;
        });
        setProjectConversations(updatedConversations);
    };

    return (
        <PalContext.Provider
            value={{
                contextMessages,
                projectConversations,
                addContextMessage,
                updateContextMessages,
                addProjectConversation,
                updateProjectConversations,
                updateConversationCreatedAt
            }}>
            {children}
        </PalContext.Provider>
    );
};
