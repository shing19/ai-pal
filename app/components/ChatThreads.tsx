"use client"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useChat, Message } from 'ai/react'

const ChatThreads = () => {
    const { input, handleInputChange, handleSubmit, isLoading, messages } = useChat()

    return (
        <div>
            {messages.map((message: Message) => {
                return (
                    <div key={message.id}>
                        {
                            message.role === "assistant"
                                ?
                                <h5>GPT</h5>
                                :
                                <h5>User</h5>
                        }
                        {message.content.split('\n').map((currentTextBlock: string, index: number) => {
                            // 这边可以改成整个 markdown 包裹，所以不用特意加空行
                            // if (currentTextBlock === "") {
                                // return <p key={message.id + index}>&nbsp;</p>
                                // return null
                            // } else {
                                return (
                                    <p key={message.id + index}>{currentTextBlock}</p>
                                )
                            // }
                        })}
                    </div>
                )
            })}
            <form onSubmit={handleSubmit}>
                <p>user message</p>
                <Textarea
                    placeholder='input somthing'
                    value={input}
                    onChange={handleInputChange}
                />
                <Button>Send message</Button>
            </form>
        </div>
    )
}

export default ChatThreads