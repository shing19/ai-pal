// ChatThreads.tsx
"use client"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useChat, Message } from 'ai/react'
import Chat from './Chat'
import ChatInput from './ChatInput'
import { PaperPlaneIcon } from "@radix-ui/react-icons"
import { MessageLog } from '@/types/global'
import { use, useContext, useEffect, useState } from 'react'
import { PalContext } from './PalContext';
import Conversation from './Conversation'


const ChatThreads = () => {
    const { input, handleInputChange, handleSubmit, isLoading, messages } = useChat()
    const { contextMessages, updateContextMessages, projectConversations, updateProjectConversations } = useContext(PalContext);

    useEffect(() => {
        console.log('projectConversations', projectConversations)
    }, [projectConversations])

    return (
        <div>
            {projectConversations?.map((conversation, index) => {
                return (
                    <div key={index}>
                        <Conversation conversation={conversation} />
                    </div>
                );
            })}
            <Chat messages={messages} />
            <div style={{ position: 'relative' }}>
                <ChatInput
                    input={input}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                    messages={messages} />
            </div>
        </div>
    )
}

export default ChatThreads