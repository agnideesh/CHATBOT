// This is a client-side service that will call our API endpoint
// We don't use OpenAI client directly in the browser

/**
 * Processes a user message and returns an AI response
 * @param message The user's message
 * @returns Promise with the AI's response
 */
export async function getAIResponse(message: string): Promise<string> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('Error calling AI API:', error);
    return "I'm sorry, there was an error processing your request. Please try again later.";
  }
}

/**
 * Gets a streaming AI response
 * @param message User message
 * @param onContent Callback for content chunks
 * @param onReasoning Callback for reasoning chunks (optional)
 * @param onComplete Callback when complete
 */
export async function getStreamingAIResponse(
  message: string,
  onContent: (content: string) => void,
  onReasoning?: (reasoning: string) => void,
  onComplete?: () => void
): Promise<void> {
  try {
    // Simulate a brief initial delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const response = await fetch('/api/chat-stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    if (!response.body) {
      throw new Error('Response body is empty');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      try {
        const jsonChunks = chunk
          .split('\n')
          .filter(line => line.trim() !== '')
          .map(line => JSON.parse(line));
        
        for (const jsonChunk of jsonChunks) {
          if (jsonChunk.type === 'content' && jsonChunk.value) {
            onContent(jsonChunk.value);
            fullContent += jsonChunk.value;
          } else if (jsonChunk.type === 'reasoning' && jsonChunk.value && onReasoning) {
            onReasoning(jsonChunk.value);
          }
        }
      } catch (e) {
        console.error('Error parsing chunk:', e);
      }
    }

    if (onComplete) {
      onComplete();
    }
  } catch (error) {
    console.error('Error in streaming AI response:', error);
    onContent("I'm sorry, there was an error processing your request. Please try again later.");
    if (onComplete) {
      onComplete();
    }
  }
} 