import {
  ParsedEvent,
  ReconnectInterval,
  createParser,
} from "eventsource-parser";

export type ChatGPTAgent = "user" | "system";

export interface ChatGPTMessage {
  role: ChatGPTAgent;
  content: string;
}

export interface OpenAIStreamPayload {
  model: string;
  messages: ChatGPTMessage[];
  stream: boolean;
  // temperature: number | null;
  // top_p: number | null;
  // frequency_penalty: number | null;
  // presence_penalty: number | null;
  // max_tokens: number | null;
  // n: number | null;
}

export async function OpenAIStream(payload: OpenAIStreamPayload) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const res = await fetch("https://openai-proxy.diandian.info/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  let counter = 0;

  if (res.ok) {

    const stream = new ReadableStream({
      async start(controller) {
        function push(event: ParsedEvent | ReconnectInterval) {
          if (event.type === "event") {
            const { data } = event;

            if (data === "[DONE]") {
              controller.close();
              return;
            }

            try {
              const json = JSON.parse(data);
              // 可以看到stream返回的数据，之前用来看停止原因是stop还是lenth
              // console.log(json.choices); 
              const text = json.choices[0].delta?.content || "";

              if (counter < 2 && (text.match(/\n/) || []).length) {
                return;
              }

              const queue = encoder.encode(text);
              controller.enqueue(queue);
              counter++;
            } catch (err) {
              controller.error(err);
            }
          }
        }

        const parser = createParser(push);

        try {
          for await (const chunk of res.body as any) {
            parser.feed(decoder.decode(chunk));
          }
        } catch (err) {
          console.error('Stream read error:', err); // 记录从响应体读取时的错误
          controller.error(err); // 将错误传达到流中，导致流结束
        }
      },
    });

    return stream;
  } else {
    // 处理错误情况
    const errorMessage = await res.text(); // 或者res.json()，取决于错误响应的格式
    console.error('Error response from OpenAI API:', errorMessage);

    // 创建一个包含错误信息的流
    const errorStream = new ReadableStream({
      start(controller) {
        // 将错误消息编码成Uint8Array并放入流中
        controller.enqueue(new TextEncoder().encode(errorMessage));
        // 关闭流
        controller.close();
      }
    });

    // 返回错误信息流
    return errorStream;
  }
}
