// PromptContext.tsx
import { PalContext } from './Context/PalContext';
import { useChat, Message } from 'ai/react'
import React, { use, useContext, useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import ChatDialog from './Chat/ChatDialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CheckIcon, Cross2Icon, PaperPlaneIcon } from "@radix-ui/react-icons"
import { nanoid } from 'ai';
import { useSearchParams } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';


const PromptContext = () => {
    const { contextMessages, addContextMessage, projectConversations, updateConversationCreatedAt, addProjectConversation, updateContextMessages } = useContext(PalContext);
    const { input, handleInputChange, handleSubmit, isLoading, messages, setMessages } = useChat()
    const [newConversation, setNewConversation] = useState<boolean>(false)
    const [thisMessages, setThisMessages] = useState<Message[]>([])
    const [thisConversationCreatedAt, setThisConversationCreatedAt] = useState<Date>()
    const [newMessage, setNewMessage] = useState<Message[]>([])
    const [newContent, setNewContent] = useState<string>('')
    const [isAdding, setIsAdding] = useState<boolean>(false)
    const [newMeesageId, setNewMessageId] = useState<string>('')
    const [projectId, setProjectId] = useState<string>('')
    const visitProjectId = useSearchParams().get('projectId')

    useEffect(() => {
        if (visitProjectId && visitProjectId !== projectId) {
            const projectId = visitProjectId
            setProjectId(projectId)
            // 更新contextMessages
        }
    }, [visitProjectId])

    // input text area
    const [isComposing, setIsComposing] = useState(false); // 添加状态跟踪是否处于组合输入模式
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const autoResizeTextarea = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = '22px'; // 重置高度，允许它减小
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };
    useEffect(() => {
        autoResizeTextarea();
    }, [input]);



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
        const newMessage = [...contextMessages, ...messages.filter(m => !previousMessages.includes(m))];
        setMessages(newMessage);
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

    // 更新对话
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

    // console.log('contextMessages', contextMessages)

    // 添加消息
    const handleSave = () => {
        const id = nanoid()

        // 添加消息
        addContextMessage([{
            createdAt: new Date(),
            content: newContent,
            role: "user",
            id: id
        }])
        setIsAdding(false)
        setNewContent('')
    }

    return (
        <div className='h-full m-2 flex flex-col'>
            <div className='text-lg pl-2'>
                Project Name
            </div>
            <div className='my-1'>
                <Separator />
            </div>
            {/* 这里是context */}
            <div className='flex flex-col h-full box-border justify-between overflow-y-auto overflow-x-hidden'
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <div>
                    <ChatDialog
                        messages={contextMessages}
                        conversationCreatedAt={undefined}
                    />
                    {isAdding &&
                        <div className='mt-2'>
                            <div className="flex space-x-2 items-center w-full">
                                <Badge variant="secondary">User</Badge>
                                <span className="text-sm text-muted-foreground">{new Date().toLocaleString()}</span>
                            </div>
                            <div className="mx-0.5 mt-2">
                                <div className='flex flex-col space-y-2 items-end'>
                                    <Textarea
                                        value={newContent}
                                        onChange={(e) => setNewContent(e.target.value)}
                                        onKeyDown={(e) => {
                                            // Check if 'Enter' is pressed without the 'Shift' key
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault(); // Prevents adding a new line
                                                handleSave(); // Call the save handler
                                            }
                                        }}
                                        className="w-full h-auto box-border rounded"
                                        style={{ resize: 'none' }}
                                    >
                                    </Textarea>
                                    <div className='flex space-x-2'>
                                        <Button className='h-8' variant="secondary" onClick={() => setIsAdding(false)}>
                                            取消
                                        </Button>
                                        <Button className='h-8' variant="default" onClick={() => handleSave()}>
                                            确认
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    <Button className='my-3 w-full' variant="ghost" onClick={() => setIsAdding(true)}>
                        <Separator />
                        <div className='mx-4' style={{ color: 'hsl(var(--primary)' }}>
                            新增消息
                        </div>
                        <Separator />
                    </Button>
                </div>
                <div className='mx-1 relative mb-2'>
                    <div className='max-h-36 overflow-y-auto border-2 rounded-md p-2 shadow-sm text-sm'
                        style={{ borderColor: 'hsl(val(--input))', borderWidth: '1px' }}>
                        <form onSubmit={(e) => {
                            e.preventDefault(); // 防止默认提交行为
                            if (!isComposing) { // 当不处于组合输入状态时才处理提交
                                handleSubmitExtended(e)
                            }
                        }}>
                            <textarea
                                ref={textareaRef}
                                placeholder='Say something...'
                                value={input}
                                onChange={(e) => {
                                    handleInputChange(e);
                                    e.stopPropagation(); // 阻止事件冒泡
                                }}
                                onCompositionStart={() => setIsComposing(true)}
                                onCompositionEnd={() => {
                                  setIsComposing(false);
                                  autoResizeTextarea(); // 在组合输入结束后调整高度
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
                                        e.preventDefault();
                                        // @ts-ignore
                                        handleSubmitExtended(e);
                                        e.stopPropagation(); // 阻止事件冒泡
                                    }
                                }}
                                className='w-full block max-h-none text-sm pr-6 outline-none appearance-none resize-none border-0 shadow-none focus:border-0'

                                style={{ resize: 'none'}}
                            />
                            <Button
                                type="submit"
                                variant="secondary"
                                size='icon'
                                disabled={isLoading} // 根据isLoading状态禁用按钮
                                className='absolute right-2 bottom-2 h-6 w-6 rounded-full'
                            >
                                <PaperPlaneIcon className='h-3 w-3' />
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromptContext;