import { ConversationWithinContext } from '@/types/global';
import { Message } from 'ai'
import React from 'react'
import Chat from './Chat';
import ChatInput from './ChatInput';
import { useChat } from 'ai/react';

interface ConversationProps {
    conversation: ConversationWithinContext;
}

const Conversation = ({ conversation }: ConversationProps) => {
    const { input, handleInputChange, handleSubmit, isLoading, messages } = useChat();
    const filteredMessages = conversation.messages.filter(
        (msg) => !conversation.context.includes(msg)
    );

    return (
        <div>
            <Chat messages={filteredMessages} />
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