// PalContext.js
import React, { createContext, useState } from 'react';
import { MessageLog } from "@/types/global"

interface PalContextValue {
    messages: MessageLog[];
    updateMessages: (newMessages: MessageLog[]) => void;
  }
  
export const PalContext = createContext<PalContextValue>({
    messages: [],
    updateMessages: () => {}
});

// @ts-ignore
export const PalProvider = ({ children }) => {

    const [messages, setMessages] = useState<MessageLog[]>([]);

    const [draggedMessage, setDraggedMessage] = useState<MessageLog | null>(null);
    const updateMessages = (newMessages: MessageLog[]) => {
        setMessages((prevMessages) => [...prevMessages, ...newMessages]);
    }

    return (
        <PalContext.Provider value={{ messages, updateMessages  }}>
            {children}
        </PalContext.Provider>
    );
};
