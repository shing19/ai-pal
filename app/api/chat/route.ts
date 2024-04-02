import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from "ai"
import { NextResponse } from 'next/server';

export const runtime = 'edge'

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
//     baseURL: process.env.OPENAI_BASE_URL
// });

const openai = new OpenAI({
    apiKey: process.env.MOONSHOT_API_KEY,
    baseURL: process.env.MOONSHOT_BASE_URL
});

export async function POST(request: Request) {
    const { messages, data } = await request.json()
    const contextMessages = data?.context ? JSON.parse(data.context) : []
    const conversationMessages = data?.conversationMessages ? JSON.parse(data.conversationMessages) : []
    let mergedMessages = [
        ...contextMessages,
        ...conversationMessages
    ].filter((message, index, self) => {
        // 检查当前消息是否已经在数组中的其他位置出现过
        return self.findIndex(el => el.id === message.id) === index;
    });
    // 只保留 role 和 content 属性
    mergedMessages = mergedMessages.map(({ role, content }) => ({ role, content }))
    // 和 messages 去重
    const uniqueMessagesArray = new Set([
        ...mergedMessages,
        ...messages
    ]);
    const uniqueMessages = Array.from(uniqueMessagesArray);

    // 留着 debug 用
    console.log("this conversation:")
    console.log(uniqueMessages)

    try {
        const response = await openai.chat.completions.create({
            // model: 'gpt-3.5-turbo',
            model: "moonshot-v1-8k",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                ...mergedMessages,
                ...messages
            ],
            stream: true
        })

        const stream = await OpenAIStream(response)
        return new StreamingTextResponse(stream)
    } catch (error) {
        // 如果出现错误,设置备用 baseURL 并重试
        // try {
        //     openai.baseURL = process.env.OPENAI_BASE_URL_BACKUP || ""

        //     const response = await openai.chat.completions.create({
        //         model: 'gpt-3.5-turbo',
        //         messages: [
        //             { role: "system", content: "You are a helpful assistant." },
        //             ...messages
        //         ],
        //         stream: true
        //     })

        //     const stream = await OpenAIStream(response)
        //     return new StreamingTextResponse(stream)
        // } catch (error) {
        //     // Check if the error is an APIError
        //     if (error instanceof OpenAI.APIError) {
        //         const { name, status, headers, message } = error;
        //         return NextResponse.json({ name, status, headers, message }, { status });
        //     } else {
        //         throw error;
        //     }
        // }

        // Check if the error is an APIError
        if (error instanceof OpenAI.APIError) {
            const { name, status, headers, message } = error;
            return NextResponse.json({ name, status, headers, message }, { status });
        } else {
            throw error;
        }
    }
}