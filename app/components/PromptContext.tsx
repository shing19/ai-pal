// PromptContext.tsx
import React, { use, useContext, useEffect, useState } from 'react';
import { PalContext } from './Context/PalContext';
import { useChat, Message } from 'ai/react'
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import ChatDialog from './Chat/ChatDialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PaperPlaneIcon } from "@radix-ui/react-icons"


const PromptContext = () => {
    const { contextMessages, addContextMessage, projectConversations, updateConversationCreatedAt, addProjectConversation } = useContext(PalContext);
    const { input, handleInputChange, handleSubmit, isLoading, messages, setMessages } = useChat()
    const [ newConversation, setNewConversation ] = useState<boolean>(false)
    const [ thisMessages, setThisMessages ] = useState<Message[]>([])
    const [ thisConversationCreatedAt, setThisConversationCreatedAt ] = useState<Date>()


    // input text area
    const [inputHeight, setInputHeight] = useState('auto');
    const [isComposing, setIsComposing] = useState(false); // 添加状态跟踪是否处于组合输入模式
    useEffect(() => {
        if (input.length > 80 || /\n{2,}/.test(input)) {
            setInputHeight('7rem')
        } else {
            setInputHeight('2rem')
        }
    }, [input])

    // 拖拽更新 context messages
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const transferMessage = e.dataTransfer.getData('application/json');
        const droppedMessage = transferMessage ? JSON.parse(transferMessage) : null;
        // 如果消息存在且不在当前消息列表中,则更新消息列表
        if (droppedMessage && !contextMessages.find(m => m.id === droppedMessage.id)) {
            addContextMessage([droppedMessage]);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    // 处理新对话
    const handleSubmitExtended = (e: React.FormEvent<HTMLFormElement>) => {
        setThisMessages([])
        const previousMessages = messages
        const newMessages = [...contextMessages, ...messages.filter(m => !previousMessages.includes(m))];
        setMessages(newMessages);
        handleSubmit(e, {
            data: {
                context: JSON.stringify(contextMessages)
            },
        });
        setNewConversation(true)
        setThisConversationCreatedAt(new Date())
    }

    // messages不变也会一直刷新，所以要过滤一下，避免陷入死循环
    useEffect(() => {
        if ((messages !== thisMessages)) {
            setThisMessages(messages)
        }
    }, [messages])

    useEffect(() => {
        // 判断是否是新对话，查看projectConversations里是否有latestConversationCreatedAt
        function ConversationExists() {
            return projectConversations.some(conversation => conversation.createdAt === thisConversationCreatedAt)
        }
        // 如果不存在对话，且是新对话，且消息长度为2，则创建新对话
        if (!(ConversationExists()) && newConversation && thisConversationCreatedAt && ((thisMessages.length - contextMessages.length == 1))) {
            const newConversation = {
                context: contextMessages,
                messages: thisMessages,
                createdAt: thisConversationCreatedAt,
            }
            addProjectConversation([newConversation])
            // 重置状态
            setNewConversation(false)
        }

        // 如果存在对话，则更新对话
        if (ConversationExists() && thisConversationCreatedAt) {
            updateConversationCreatedAt(thisConversationCreatedAt, thisMessages)
        }
    }, [thisMessages, isLoading, thisConversationCreatedAt])


    return (
        <div className='h-full'>
            <div className='flex flex-col h-5/6'
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <Card>
                    <CardHeader>PromptContext Component</CardHeader>
                    <CardContent>
                        <ChatDialog
                            messages={contextMessages}
                            conversationCreatedAt={undefined}
                        />
                        {/* 这里可能会修改，不一定有这样固定的输入部分 */}
                        <form onSubmit={(e) => {
                            e.preventDefault(); // 防止默认提交行为
                            if (!isComposing) { // 当不处于组合输入状态时才处理提交
                                handleSubmitExtended(e)
                            }
                        }} style={{ display: 'flex', flexDirection: 'column', position: 'relative', paddingBottom: '3rem' }}>
                            <Textarea
                                placeholder='Say something...'
                                value={input}
                                onChange={(e) => {
                                    handleInputChange(e);
                                    e.stopPropagation(); // 阻止事件冒泡
                                }}
                                onCompositionStart={() => setIsComposing(true)} // 开始组合输入
                                onCompositionEnd={() => setIsComposing(false)} // 结束组合输入
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
                                        e.preventDefault();
                                        // @ts-ignore
                                        handleSubmitExtended(e);
                                        e.stopPropagation(); // 阻止事件冒泡
                                    }
                                }}
                                style={{ display: 'flex', alignItems: 'center', height: inputHeight }}
                            />
                            <Button
                                type="submit"
                                variant="ghost"
                                size='icon'
                                disabled={isLoading} // 根据isLoading状态禁用按钮
                                style={{
                                    position: 'absolute',
                                    bottom: '0.5rem', // 调整按钮距离底部的距离
                                    right: '0rem', // 调整按钮距离右侧的距离
                                }}
                            >
                                <PaperPlaneIcon />
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PromptContext;