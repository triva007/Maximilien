import type { Message } from './types';

// This function now runs on the client (in the browser).
// It calls our own backend API endpoint, which will then securely call the Gemini API.
export const sendMessageToModel = async (history: Message[]): Promise<string> => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ history }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `A server error occurred: ${response.statusText}`);
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Error sending message to backend:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred while communicating with the server.');
  }
};
