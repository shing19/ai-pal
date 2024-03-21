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
        const updatedConversations = projectConversations.map(conversation => {
            if (conversation.createdAt === createdAt) {
                if (conversation.messages !== updatedMessages) {
                    return {
                        ...conversation,
                        messages: updatedMessages,
                    };
                }
            }
            return conversation
        })
        setProjectConversations(updatedConversations);
    }

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
