// ChatThreads.tsx
"use client"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useChat, Message } from 'ai/react'
import Chat from './Chat'
import { PaperPlaneIcon } from "@radix-ui/react-icons"
import { MessageLog } from '@/types/global'
import { useEffect, useState } from 'react'


const ChatThreads = () => {
    const { input, handleInputChange, handleSubmit, isLoading, messages } = useChat()
    const [ messagesLog, setMessagesLog ] = useState<MessageLog[]>([])

    // 更新消息记录 ➡️ 记录时间戳
    useEffect(() => {
        const updatedMessagesLog = messages.map(newMessage => {
            const existingMessage = messagesLog.find(m => m.id === newMessage.id)
            if (existingMessage) {
                // 如果消息已经存在,更新消息内容但保持 createdAt 不变
                return { ...existingMessage, content: newMessage.content }
            } else {
                // 如果是新消息,添加 createdAt 时间戳
                return { ...newMessage, createdAt: Date.now() }
            }
        })
        setMessagesLog(updatedMessagesLog)
    }, [messages])


    return (
        <div>
            <Chat messages={messagesLog} />
            <div style={{ position: 'relative' }}>
                <form onSubmit={handleSubmit}>
                    <p>user message</p>
                    <Textarea
                        placeholder='input somthing'
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                // @ts-ignore
                                handleSubmit(e)
                            }
                        }}
                        style={{ position: 'relative' }}
                    />
                    <Button
                        type="submit"
                        variant="ghost"
                        size='icon'
                        style={{
                            position: 'absolute',
                            bottom: '-40px', // 调整距离底部的距离
                            right: '0px', // 调整距离右侧的距离
                        }}
                    >
                        <PaperPlaneIcon />
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default ChatThreads