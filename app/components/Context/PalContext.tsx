// PalContext.js
import React, { createContext, useState } from 'react';
import { ConversationWithinContext } from "@/types/global"
import { Message } from 'ai/react'

interface PalContextValue {
    contextMessages: Message[];
    updateContextMessages: (newMessages: Message[]) => void;
    projectConversations: ConversationWithinContext[],
    addProjectConversation: (newMessages: ConversationWithinContext[]) => void;
    updateProjectConversations: (updatedConversations: ConversationWithinContext[]) => void;
    updateConversationCreatedAt: (createdAt: Date, updatedMessages: Message[]) => void;
}

export const PalContext = createContext<PalContextValue>({
    contextMessages: [],
    updateContextMessages: () => { },
    projectConversations: [],
    addProjectConversation: () => { },
    updateProjectConversations: () => { },
    updateConversationCreatedAt: () => { },
});

// @ts-ignore
export const PalProvider = ({ children }) => {

    const [contextMessages, setContextMessages] = useState<Message[]>([]);
    const [projectConversations, setProjectConversations] = useState<ConversationWithinContext[]>([]);

    const updateContextMessages = (newMessages: Message[]) => {
        setContextMessages((prevMessages) => [...prevMessages, ...newMessages]);
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
                updateContextMessages,
                projectConversations,
                addProjectConversation,
                updateProjectConversations,
                updateConversationCreatedAt
            }}>
            {children}
        </PalContext.Provider>
    );
};
