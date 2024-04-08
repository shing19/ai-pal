// Chat.tsx
import React, { useContext, useState } from 'react'
import { Message } from 'ai/react'
import { Button } from "@/components/ui/button"
import { CheckIcon, Cross2Icon, Pencil1Icon } from '@radix-ui/react-icons'
import { PalContext } from '../Context/PalContext'
import { Badge } from "@/components/ui/badge"

interface ChatDialogProps {
    messages: Message[],
    conversationCreatedAt: Date | undefined
}

interface showButtonsState {
    [key: string]: boolean;
}

interface editState {
    [key: string]: boolean;
}


const ChatDialog = ({ messages, conversationCreatedAt }: ChatDialogProps) => {
    const { contextMessages, projectConversations, updateConversationCreatedAt, updateContextMessages } = useContext(PalContext);
    const [showButtons, setshowButtons] = useState<showButtonsState>({});
    const [isEditing, setIsEditing] = useState(false);
    const [edieState, setEditState] = useState<editState>({});
    const [newContent, setNewContent] = useState('');
    const [dragOverId, setDragOverId] = useState<string>('');

    // 拖拽事件
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, message: Message) => {
        e.dataTransfer.setData('application/json', JSON.stringify(message));
    };


    // 删除对话（仅作用在context里）
    const toggleDeleteButton = (messageId: string) => {
        setshowButtons((prevState: showButtonsState) => ({
            ...prevState,
            [messageId]: !prevState[messageId],
        }));
    };
    const handleDelete = (messageId: string) => {
        const newMessages = messages.filter(message => message.id !== messageId)
        // 在context里更新
        if (conversationCreatedAt === undefined) {
            updateContextMessages(newMessages)
        } else {
            // 在conversations里更新
            projectConversations.map(conversation => {
                if (conversation.createdAt === conversationCreatedAt) {
                    const dialogMessages = conversation.messages.filter(
                        (msg) => !conversation.context.includes(msg)
                    );
                    // console.log('dialogMessages', dialogMessages)
                    if (newMessages !== dialogMessages) {
                        const newMessagesWithinContext = [...conversation.context, ...newMessages];
                        // console.log('newMessagesWithinContext', newMessagesWithinContext)
                        updateConversationCreatedAt(conversationCreatedAt, newMessagesWithinContext)
                    }
                }
            })
        }
    };


    // 编辑信息
    const handleEdit = (messageId: string) => {
        toggleEditState(messageId)
        setNewContent(messages.find(message => message.id === messageId)?.content || '')
    };
    const handleCancel = (messageId: string) => {
        toggleEditState(messageId)
    }
    const toggleEditState = (messageId: string) => {
        setEditState((prevState: editState) => ({
            ...prevState,
            [messageId]: !prevState[messageId],
        }));
    }
    const handleSave = (messageId: string) => {
        // 在 messages 里找到id相同的，然后更新content
        const newMessages = messages.map(message => {
            if (message.id === messageId) {
                return {
                    ...message,
                    content: newContent
                }
            }
            return message
        })
        updateContextMessages(newMessages)
        toggleEditState(messageId)
    }

    // 在display conversation的时候，不显示context message
    let displayMessages = messages;
    if (conversationCreatedAt !== undefined) {
        projectConversations.map(conversation => {
            if (conversation.createdAt === conversationCreatedAt) {
                displayMessages = conversation.messages.filter(
                    (msg) => !conversation.context.some(ctx => ctx.id === msg.id)
                );
            }
        })
    }


    // 拖拽事件
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, messageId: string) => {
        e.preventDefault();
        setDragOverId(messageId); // 设置当前hover的消息的id
    };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const transferMessage = e.dataTransfer.getData('application/json');
        const droppedMessage = transferMessage ? JSON.parse(transferMessage) : null;
        // 如果消息存在且在当前消息列表中，则更新消息列表
        if (droppedMessage) {
            const foundIndex = contextMessages.findIndex(m => m.id === droppedMessage.id);
            if (foundIndex !== -1) {
                // 从现有数组中移除这个元素
                const newMessages = [...contextMessages];
                newMessages.splice(foundIndex, 1);
                // 在新的位置插入这个元素
                const dropAtIndex = contextMessages.findIndex(m => m.id === dragOverId);
                newMessages.splice(dropAtIndex, 0, droppedMessage);
                // console.log('newMessages', newMessages)
                // 更新contextMessages
                updateContextMessages(newMessages);
            }
        }
    };


    return (
        <div>
            {displayMessages.length > 0 && displayMessages.map((message) => {
                const showButton = showButtons[message.id] || false;

                return (
                    <div
                        key={message.id}
                        className="mt-2"
                        onMouseEnter={() => toggleDeleteButton(message.id)}
                        onMouseLeave={() => toggleDeleteButton(message.id)}
                        draggable
                        onDragStart={(e) => handleDragStart(e, message)}
                        onDragOver={(e) => handleDragOver(e, message.id)} // 添加 onDragOver 事件
                        onDrop={handleDrop}  // 添加 onDrop 事件
                    >
                        <div
                            className='flex justify-between h-6'
                            draggable
                            onDragStart={(e) => handleDragStart(e, message)}
                        >
                            <div className="flex space-x-2 items-center">
                                {message.role === 'assistant' ? <Badge>Bot</Badge> : <Badge variant="secondary">User</Badge>}
                                {message.createdAt && <span className="text-sm text-muted-foreground">{new Date(message.createdAt).toLocaleString()}</span>}
                            </div>
                            {showButton && !conversationCreatedAt && (
                                <div className="space-x-1">
                                    <Button variant="secondary" size="icon" className="h-5 w-5" onClick={() => handleEdit(message.id)}>
                                        <Pencil1Icon className="h-3 w-3" />
                                    </Button>
                                    <Button variant="destructive" size="icon" className="h-5 w-5" onClick={() => handleDelete(message.id)}>
                                        <Cross2Icon className="h-3 w-3" />
                                    </Button>
                                </div>
                            )}
                        </div>
                        <div className="ml-1 mt-2">
                            {edieState[message.id] ? (
                                <div className='flex flex-col space-y-2 items-center'>
                                    <textarea
                                        value={newContent}
                                        onChange={(e) => setNewContent(e.target.value)}
                                        onKeyDown={(e) => {
                                            // Check if 'Enter' is pressed without the 'Shift' key
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault(); // Prevents adding a new line
                                                handleSave(message.id); // Call the save handler
                                            }
                                        }}
                                        className="w-full h-auto border-none outline-none rounded"
                                        style={{ resize: 'none' }}
                                    >
                                    </textarea>
                                    <div className='flex space-x-2'>
                                        <Button variant="outline" size="icon" className="h-5 w-5" onClick={() => handleSave(message.id)}>
                                            <CheckIcon className="h-3 w-3" />
                                        </Button>
                                        <Button variant="outline" size="icon" className="h-5 w-5" onClick={() => handleCancel(message.id)}>
                                            <Cross2Icon className="h-3 w-3" />
                                        </Button>

                                    </div>
                                </div>
                            ) : (
                                <div>
                                    {message.content &&
                                        message.content.split('\n').map((currentTextBlock: string, index: number) => {
                                            return <p key={message.id + index}>{currentTextBlock}</p>;
                                        })}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div >
    );
};

export default ChatDialog;