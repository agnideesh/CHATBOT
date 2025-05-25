import { NextRequest } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY || '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', // fallback for local
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    (async () => {
      try {
        // @ts-ignore - NVIDIA-specific fields
        const completion = await openai.chat.completions.create({
          model: "ibm/granite-3.3-8b-instruct",
          messages: [{ role: "user", content: message }],
          temperature: 0.2,
          top_p: 0.7,
          max_tokens: 1024,
          chat_template_kwargs: { "thinking": true }, // NVIDIA extension
          stream: true
        } as any);

        for await (const chunk of completion as any) {
          const reasoning = chunk.choices[0]?.delta?.reasoning_content;
          if (reasoning) {
            const reasoningChunk = JSON.stringify({ type: 'reasoning', value: reasoning }) + '\n';
            await writer.write(encoder.encode(reasoningChunk));
          }
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            const contentChunk = JSON.stringify({ type: 'content', value: content }) + '\n';
            await writer.write(encoder.encode(contentChunk));
          }
        }
      } catch (error) {
        const errorChunk = JSON.stringify({ 
          type: 'content', 
          value: "I'm sorry, there was an error processing your request. Please try again later." 
        }) + '\n';
        await writer.write(encoder.encode(errorChunk));
      } finally {
        await writer.close();
      }
    })();

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 