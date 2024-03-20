// ChatThreads.tsx
"use client"
import { use, useContext, useEffect, useState } from 'react'
import { PalContext } from './Context/PalContext';
import ChatConversation from './Chat/ChatConversation'


const ChatThreads = () => {
    const { projectConversations } = useContext(PalContext);

    return (
        <div>
            {projectConversations?.map((conversation, index) => {
                return (
                    <div key={index}>
                        <ChatConversation conversation={conversation} />
                    </div>
                );
            })}
        </div>
    )
}

export default ChatThreads