// ChatConversation.tsx
import { ConversationWithinContext } from '@/types/global';
import React, { useContext, useEffect, useState } from 'react'
import ChatInput from './ChatInput';
import { Message, useChat } from 'ai/react';
import { PalContext } from '../Context/PalContext';
import ChatDialog from './ChatDialog';


interface ChatConversationProps {
    conversation: ConversationWithinContext;
}

// 合并两个 Message[] 并排序消息，流式更新看后面传入的 messages
function mergeAndSort(a: Message[], b: Message[]): Message[] {
    const result: Message[] = [...a];

    for (const item of b) {
        const existingIndex = result.findIndex(i => i.id === item.id);
        if (existingIndex !== -1) {
            result[existingIndex] = item; // 如果有重复的id,替换为b中的消息
        } else {
            result.push(item);
        }
    }

    return result.sort((a, b) => {
        const aDate = typeof a.createdAt === 'string' ? new Date(a.createdAt) : a.createdAt;
        const bDate = typeof b.createdAt === 'string' ? new Date(b.createdAt) : b.createdAt;

        if (aDate && bDate) {
            return aDate.getTime() - bDate.getTime();
        } else if (aDate) {
            return -1;
        } else if (bDate) {
            return 1;
        } else {
            return 0;
        }
    });
}

const ChatConversation = ({ conversation }: ChatConversationProps) => {
    const { projectConversations, updateConversationCreatedAt } = useContext(PalContext);
    const { input, handleInputChange, handleSubmit, isLoading, messages, setMessages } = useChat();
    const [thisMessages, setThisMessages] = useState<Message[]>([]);


    // 找到streaming更新的对话信息，从context里获得
    const displayMessages = conversation.messages.filter(
        (msg) => !conversation.context.includes(msg)
    );

    const handleSubmitExtended = (e: React.FormEvent<HTMLFormElement>) => {
        const newMessages = mergeAndSort(conversation.context, messages);
        setMessages(newMessages);
        handleSubmit(e);
    }

    // messages不变也会一直刷新，所以要过滤一下，避免陷入死循环
    useEffect(() => {
        if ((messages.length > 0 && messages !== thisMessages)) {
            setThisMessages(messages)
            const newMessages = mergeAndSort(displayMessages, messages);
            updateConversationCreatedAt(conversation.createdAt, newMessages)
        }
    }, [messages])


    return (
        <div>
            {displayMessages.length > 0 &&
                <div>
                    <ChatDialog
                        messages={displayMessages}
                        conversationCreatedAt={conversation.createdAt}
                    />

                    <ChatInput
                        input={input}
                        handleInputChange={handleInputChange}
                        handleSubmit={handleSubmitExtended}
                        isLoading={isLoading}
                        messages={messages} />
                </div>
            }
        </div>
    )
}

export default ChatConversation