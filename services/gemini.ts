
import type { Message } from '../types';

// This function now calls our OWN backend endpoint, not Google's.
// It's safe to use in the frontend.
export const sendMessageToModel = async (message: string, history: Message[]): Promise<string> => {
    
    // We filter out the initial message and the "typing" indicator before sending history.
    // FIX: Correctly access the 'text' property within the 'parts' array of the Message object.
    const cleanHistory = history.slice(1).filter(m => m.parts[0].text !== '...');

    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, history: cleanHistory }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch from API');
    }

    const data = await response.json();
    return data.text;
};
