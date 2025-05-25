import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize the OpenAI client with NVIDIA API configuration
const openai = new OpenAI({
  apiKey: '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',
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // @ts-expect-error - NVIDIA API supports chat_template_kwargs but OpenAI types don't
    const completion = await openai.chat.completions.create({
      model: "ibm/granite-3.3-8b-instruct",
      messages: [{ role: "user", content: message }],
      temperature: 0.2,
      top_p: 0.7,
      max_tokens: 1024,
      chat_template_kwargs: { "thinking": true },
      stream: true // Enable streaming
    });

    // Create a readable stream for the response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              const data = `data: ${JSON.stringify({ content })}\n\n`;
              controller.enqueue(encoder.encode(data));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}