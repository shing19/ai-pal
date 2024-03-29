// ChatInput.tsx
"use client"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Message } from 'ai/react'
import { PaperPlaneIcon } from "@radix-ui/react-icons"
import { ChatRequestOptions } from '@/types/global'
import { useEffect, useState } from 'react'

interface ChatInputProps {
    input: string;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>, chatRequestOptions?: ChatRequestOptions) => void;
    isLoading: boolean;
    messages: Message[];
}

const ChatInput: React.FC<ChatInputProps> = ({ input, handleInputChange, handleSubmit, isLoading, messages }) => {

    const [inputHeight, setInputHeight] = useState('auto');
    const [isComposing, setIsComposing] = useState(false); // 添加状态跟踪是否处于组合输入模式

    // 处理灵活的input高度
    useEffect(() => {
        if (input.length > 80 || /\n{2,}/.test(input)) {
            setInputHeight('7rem')
        } else {
            setInputHeight('2rem')
        }
    }, [input])

    return (
        <div className="chat-input-container">
            <form onSubmit={(e) => {
                e.preventDefault(); // 防止默认提交行为
                if (!isComposing) { // 当不处于组合输入状态时才处理提交
                    handleSubmit(e);
                }
            }} style={{ display: 'flex', flexDirection: 'column', position: 'relative', paddingBottom: '3rem' }}>
                <p>user message</p>
                <Textarea
                    placeholder='input something'
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
                            handleSubmit(e);
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
        </div>
    )
}

export default ChatInput