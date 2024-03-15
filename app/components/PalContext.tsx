// PalContext.js
import React, { createContext, useState } from 'react';
import { ConversationWithinContext } from "@/types/global"
import { Message } from 'ai/react'

interface PalContextValue {
    contextMessages: Message[];
    updateContextMessages: (newMessages: Message[]) => void;
    projectConversations: ConversationWithinContext[],
    updateProjectConversations: (newMessages: ConversationWithinContext[]) => void;
}

export const PalContext = createContext<PalContextValue>({
    contextMessages: [],
    updateContextMessages: () => { },
    projectConversations: [],
    updateProjectConversations: () => { },
});

// @ts-ignore
export const PalProvider = ({ children }) => {

    const [contextMessages, setContextMessages] = useState<Message[]>([]);
    const [projectConversations, setProjectConversations] = useState<ConversationWithinContext[]>([]);

    const updateContextMessages = (newMessages: Message[]) => {
        setContextMessages((prevMessages) => [...prevMessages, ...newMessages]);
    }
    const updateProjectConversations = (newConversations: ConversationWithinContext[]) => {
        setProjectConversations((prevConversations) => [...prevConversations, ...newConversations]);
    }

    return (
        <PalContext.Provider
            value={{
                contextMessages, 
                updateContextMessages, 
                projectConversations,
                updateProjectConversations
            }}>
            {children}
        </PalContext.Provider>
    );
};
