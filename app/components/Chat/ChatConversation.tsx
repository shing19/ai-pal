import { ConversationWithinContext } from '@/types/global';
import React, { useContext, useEffect, useState } from 'react'
import ChatInput from './ChatInput';
import { Message, useChat } from 'ai/react';
import { PalContext } from '../Context/PalContext';
import ChatDialog from './ChatDialog';


interface ChatConversationProps {
    conversation: ConversationWithinContext;
}


const ChatConversation = ({ conversation }: ChatConversationProps) => {
    const { projectConversations, updateProjectConversations } = useContext(PalContext);
    const { input, handleInputChange, handleSubmit, isLoading, messages, setMessages } = useChat();
    const [ displayMessages, setDisplayMessages] = useState<Message[]>([]);
    const [ thisMessages, setThisMessages ] = useState<Message[]>([]);

    // 找到streaming更新的对话信息，从context里获得
    useEffect(() => {
        const filteredMessages = conversation.messages.filter(
            (msg) => !conversation.context.includes(msg)
        );
        setDisplayMessages(filteredMessages);
        setMessages(conversation.messages);
    }, [conversation]);

    // // messages不变也会一直刷新，所以要过滤一下，避免陷入死循环
    // useEffect(() => {
    //     if ((messages !== thisMessages)) {
    //         setThisMessages(messages)
    //     }
    // }, [messages, thisMessages, setThisMessages])

    // // 更新用户对话到context
    // useEffect(() => {
    //     const updatedConversations = projectConversations.map((c) => {
    //         if (c.createdAt == conversation.createdAt) {
    //             if (c.messages !== thisMessages) {
    //                 return {
    //                     ...c,
    //                     messages: thisMessages,
    //                 };
    //             }
    //         }
    //         return c;
    //     })
    //     updateProjectConversations(updatedConversations)
    // }, [thisMessages]);

    return (
        <div>
            <ChatDialog
                messages={displayMessages} />
            <ChatInput
                input={input}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                messages={messages} />
        </div>
    )
}

export default ChatConversation