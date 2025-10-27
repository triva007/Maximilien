import type { Message } from './types';

// This function now runs on the client (in the browser).
// It calls our own backend API endpoint, which will then securely call the Gemini API.
export const sendMessageToModel = async (
  history: Message[],
  onChunk: (chunk: string) => void
): Promise<void> => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ history }),
    });

    if (!response.ok || !response.body) {
      const errorData = await response.json().catch(() => ({ error: `A server error occurred: ${response.statusText}` }));
      throw new Error(errorData.error);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      const chunk = decoder.decode(value, { stream: true });
      onChunk(chunk);
    }
  } catch (error) {
    console.error("Error streaming message from backend:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred while communicating with the server.');
  }
};