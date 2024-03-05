import { OpenAIStream, OpenAIStreamPayload } from "../../utils/openai-stream";
import { NextRequest, NextResponse } from 'next/server';
// import { get_encoding } from "@dqbd/tiktoken";

console.log(process.env.OPENAI_API_KEY)
if (!process.env.OPENAI_API_KEY) throw new Error("Missing OpenAI API Key");
const errorPrefix = 'Error:';

export const POST = async (req: Request) => {
  try {
    const requestData = await req.json();
    const message = requestData.message;
    const reviews = requestData.reviews;
    console.log('reviews: ', reviews);
    console.log('user: ', message);
    // const reviewsString = JSON.stringify(reviews, null, 2);
    const reviewsString = reviews.map((review: any) => {
      return `Datetime: ${review.datetime}\nReview: ${review.review}\nRating: ${review.rating}\nCategory: ${review.category}\nSub-Category: ${review.categorySub}\nAuthor: ${review.author}\Language: ${review.language}\nTerritory: ${review.territory || 'N/A'}\nOS Version: ${review.OSVersion}\nDevice: ${review.ProductName}\n`;
    }).join('\n');
    const systemMessage = `You will be presented a batch of reviews. Your task is to analyze the reviews and answer the following question: ${message}\nApproach this task step-by-step, take your time and do not skip steps:\n1. Analyze the task\n2. Find useful information from the reviews\n3. Think step-by-step and give a deep and insightful answer\n4. You can use list or table to organize your content\n5. Do a quantity analysis if it is helpful\n6. Output in Chinese`
    const prompt = `${reviewsString}`;
    console.log('prompt: ', prompt);
    // const encoding = get_encoding("cl100k_base");
    // const tokens = encoding.encode(prompt);
    // encoding.free();
    // console.log('tokens: ', tokens.length);

    // if (tokens.length > 128000) return new Response("Prompt too long", { status: 413 });

    if (!prompt) return new Response("Missing prompt", { status: 400 });

    const payload: OpenAIStreamPayload = {
      model: "gpt-4-1106-preview",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt }
      ],
      stream: true,
      // temperature: 0.7,
      // top_p: 1,
      // frequency_penalty: 0,
      // presence_penalty: 0,
      // max_tokens: 4096,
      // n: 1,
    };

    const stream = await OpenAIStream(payload);

    return new Response(stream);
  } catch (error) {
    console.log('Error occurred:', error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    } else {
      // If it's not an Error instance, you might want to handle it differently
      return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
    }
  }
}
