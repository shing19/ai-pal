// Conversation.tsx
import { ConversationWithinContext } from '@/types/global';
import React, { useContext, useDebugValue, useEffect, useState } from 'react'
import { Message, useChat } from 'ai/react';
import { PalContext } from '../Context/PalContext';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea'
import { PaperPlaneIcon } from "@radix-ui/react-icons"
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
    const { projectConversations, updateConversationCreatedAt, updateProjectConversations } = useContext(PalContext);
    const { input, handleInputChange, handleSubmit, isLoading, messages, setMessages } = useChat();

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

    // delete conversation
    const handleDelete = (createdAt: Date) => {
        const updatedConversations = projectConversations.filter(conversation => conversation.createdAt !== createdAt);
        updateProjectConversations(updatedConversations);
    }

    // 阻止点击传递到上层的折叠
    const handleTextareaClick = (event: React.MouseEvent) => {
        event.stopPropagation(); // 阻止点击事件冒泡
    };

    const handleSubmitExtended = (e: React.FormEvent<HTMLFormElement>) => {
        handleSubmit(e, {
            data: {
                context: JSON.stringify(conversation.context),
                conversationMessages: JSON.stringify(conversation.messages)
            }
        })
    }

    useEffect(() => {
        // 更新到 project conversations 里
        if (conversation.createdAt) {
            updateConversationCreatedAt(conversation.createdAt, messages);
        }
    }, [messages])


    return (
        <div>
            <Card>
                <CardContent>
                    <div className='my-6'></div>
                    <ChatDialog
                        messages={conversation.messages}
                        conversationCreatedAt={conversation.createdAt}
                    />
                    <form onSubmit={(e) => {
                        e.preventDefault(); // 防止默认提交行为
                        if (!isComposing) { // 当不处于组合输入状态时才处理提交
                            handleSubmitExtended(e);
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
                            onClick={handleTextareaClick}
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
                    {conversation.createdAt !== undefined &&
                        <div>
                            <Button variant="outline" onClick={(event) => {
                                event.stopPropagation();
                                handleDelete(conversation.createdAt)
                            }}>
                                删除对话
                            </Button>
                        </div>
                    }
                </CardContent>
            </Card>
        </div>
    )
}
export default ChatConversation
