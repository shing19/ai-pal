// Chat.tsx
import React, { useContext, useState } from 'react'
import { Message } from 'ai/react'
import { Button } from "@/components/ui/button"
import { Cross2Icon } from '@radix-ui/react-icons'
import { PalContext } from '../Context/PalContext'
import { Badge } from "@/components/ui/badge"

interface ChatDialogProps {
    messages: Message[],
    conversationCreatedAt: Date | undefined
}

interface ShowDeleteButtonsState {
    [key: string]: boolean;
}


const ChatDialog = ({ messages, conversationCreatedAt }: ChatDialogProps) => {
    const { contextMessages, projectConversations, updateConversationCreatedAt, updateContextMessages } = useContext(PalContext);
    const [showDeleteButtons, setShowDeleteButtons] = useState<ShowDeleteButtonsState>({});

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, message: Message) => {
        e.dataTransfer.setData('application/json', JSON.stringify(message));
    };


    const toggleDeleteButton = (messageId: string) => {
        setShowDeleteButtons((prevState: ShowDeleteButtonsState) => ({
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
                    if (newMessages !== dialogMessages) {
                        const newMessagesWithinContext = [...conversation.context, ...newMessages];
                        updateConversationCreatedAt(conversationCreatedAt, newMessagesWithinContext)
                    }
                }
            })
        }
    };

    return (
        <div>
            {messages.length > 0 && messages.map((message) => {
                const showDeleteButton = showDeleteButtons[message.id] || false;

                return (
                    <div
                        key={message.id}
                        className="mt-2"
                        onMouseEnter={() => toggleDeleteButton(message.id)}
                        onMouseLeave={() => toggleDeleteButton(message.id)}
                    >
                        <div
                            className='flex justify-between'
                            draggable
                            onDragStart={(e) => handleDragStart(e, message)}
                        >
                            <div className="flex space-x-2 items-center">
                                {message.role === 'assistant' ? <Badge>Bot</Badge> : <Badge variant="secondary">User</Badge>}
                                {message.createdAt && <span className="text-sm text-muted-foreground">{new Date(message.createdAt).toLocaleString()}</span>}
                            </div>
                            {showDeleteButton && (
                                <Button variant="destructive" size="icon" className="h-5 w-5" onClick={() => handleDelete(message.id)}>
                                    <Cross2Icon className="h-3 w-3" />
                                </Button>
                            )}
                        </div>
                        <div className="ml-1 mt-2">
                            {message.content &&
                                message.content.split('\n').map((currentTextBlock: string, index: number) => {
                                    return <p key={message.id + index}>{currentTextBlock}</p>;
                                })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ChatDialog;