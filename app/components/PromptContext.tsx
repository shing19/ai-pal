// Context.tsx
import React, { useContext } from 'react';
import { PalContext } from './PalContext';
import Chat from './Chat';

const PromptContext = () => {
    const { messages, updateMessages } = useContext(PalContext);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const transferMessage = e.dataTransfer.getData('application/json');
        const droppedMessage = transferMessage ? JSON.parse(transferMessage) : null;
        // 如果消息存在且不在当前消息列表中,则更新消息列表
        if (droppedMessage && !messages.find(m => m.id === droppedMessage.id)) {
            updateMessages([droppedMessage]);
        }
    };

    return (
        <div className='h-full'>
            <div className='flex flex-col h-5/6'
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <div>PromptContext Component</div>
                <Chat messages={messages} />
            </div>
        </div>
    );
};

export default PromptContext;