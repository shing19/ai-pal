// ChatThreads.tsx
"use client"
import { useContext, useEffect, useState } from 'react';
import { PalContext } from './Context/PalContext';
import ChatConversation from './Chat/ChatConversation';

const ChatThreads = () => {
    const { projectConversations } = useContext(PalContext);
    const [ expandedStates, setExpandedStates ] = useState<Record<number, boolean>>({});

    // 折叠状态管理
    useEffect(() => {
        if (projectConversations && projectConversations.length > 0) {
            setExpandedStates(prevStates => {
                // 初始化所有对话的状态为false，除了最新加入的对话
                const newStates = { ...prevStates };

                // 如果有对话（至少2个），则设置倒数第二个对话状态为false（折叠）
                if (projectConversations.length > 1) {
                    newStates[projectConversations.length - 2] = false;
                }

                // 确保最新的对话总是展开的
                newStates[projectConversations.length - 1] = true;

                return newStates;
            });
        }
    }, [projectConversations]);

    const toggleExpansion = (index: number) => {
        setExpandedStates(prevStates => ({
            ...prevStates,
            [index]: !prevStates[index],
        }));
    };

    return (
        <div>
            {projectConversations?.map((conversation, index: number) => {
                const conversationStyle = expandedStates[index] ? { height: 'auto' } : { height: '5rem', overflow: 'hidden' };
                return (
                    <div key={index} style={conversationStyle} onClick={() => toggleExpansion(index)}>
                        <ChatConversation conversation={conversation} />
                    </div>
                );
            })}
        </div>
    );
};

export default ChatThreads;