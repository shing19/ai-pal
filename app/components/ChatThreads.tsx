// ChatThreads.tsx
"use client"
import { useContext, useEffect, useRef, useState } from 'react';
import { PalContext } from './Context/PalContext';
import ChatConversation from './Chat/Conversation';

const ChatThreads = () => {
    const { projectConversations } = useContext(PalContext);
    const [expandedStates, setExpandedStates] = useState<Record<number, boolean>>({});
    const containerRef = useRef<HTMLDivElement>(null); // 创建一个ref，用于定位滚动容器
    
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

    const toggleExpansion = (index: number, event: React.MouseEvent) => {
        // 检查事件的目标是否属于 ChatInput 组件
        if ((event.target as HTMLElement).closest('.chat-input-container')) {
            // 如果是从 ChatInput 发起的点击，就停止处理
            return;
        }

        setExpandedStates(prevStates => ({
            ...prevStates,
            [index]: !prevStates[index],
        }));
    };

    // 监听projectConversations变化滚动到底部
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollIntoView({ block: "end" });
        }
    }, [projectConversations]);

    return (
        <div className='flex flex-col gap-y-1 overflow-hidden' ref={containerRef}>
            {projectConversations?.map((conversation, index: number) => {
                const conversationStyle = expandedStates[index] ?
                    { height: 'auto', transition: 'height 0.8s ease-in-out', border: '1px solid hsl(var(--input))', borderRadius: '0.5rem', overflow: 'visible' } :
                    { height: '10rem', overflow: 'hidden', border: '1px solid hsl(var(--input))', borderRadius: '0.5rem', transition: 'height 0.8s ease-in-out' };
                return conversation.messages.length > 0 ? (
                    <div key={index} style={conversationStyle} onClick={(e) => toggleExpansion(index, e)}>
                        <ChatConversation conversation={conversation} />
                    </div>
                )
                    : null
            })}
        </div>
    );
};

export default ChatThreads;