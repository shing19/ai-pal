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
}

export const PalContext = createContext<PalContextValue>({
    contextMessages: [],
    updateContextMessages: () => { },
    projectConversations: [],
    addProjectConversation: () => { },
    updateProjectConversations: () => { }
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

    return (
        <PalContext.Provider
            value={{
                contextMessages,
                updateContextMessages,
                projectConversations,
                addProjectConversation,
                updateProjectConversations
            }}>
            {children}
        </PalContext.Provider>
    );
};
