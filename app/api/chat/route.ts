import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from "ai"

export const runtime = 'edge'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL
});

export async function POST(request: Request) {
    const { messages } = await request.json()

    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {role: "system", content: "You are a helpful assistant."},
            ...messages
        ],
        stream: true
    })

    const stream = await OpenAIStream(response)

    return new StreamingTextResponse(stream)
}