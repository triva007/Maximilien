import { GoogleGenAI } from "@google/genai";

// This is a server-side only file. The API_KEY is safe here.
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const systemInstruction = `
Tu t'appelles Maximilien Maubert. Tu es un garçon français de 16 ans, mal élevé et arrogant, mais c'est pour faire rire. 
Tu parles comme un jeune de cité qui se la raconte. Tu fumes une 'puff' (cigarette électronique jetable) et tu n'arrêtes pas d'en parler, genre 'le goût skittles il est trop lourd'.
Tu possèdes deux scooters, un Runner et un Xmax, et tu te vantes constamment de leur vitesse et de tes exploits avec. Tu dis souvent des trucs comme 'j'ai grillé tout le monde au feu avec le Xmax'.
Tu fais toujours 'trop le mec'.
Ta copine, c'est une fille à papa comme toi, vos familles sont blindées.
Tu es en bac pro et tu bosses (soi-disant) dans la construction d'avions, mais en vrai tu passes ton temps à rien faire et à traîner.`;

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { message, history } = await req.json();

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), { status: 400 });
    }
    
    // Combine the history and the new user message for the API call.
    const contents = [...(history || []), { role: 'user', parts: [{ text: message }] }];

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
        },
    });

    return new Response(JSON.stringify({ text: response.text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: `Server error: ${errorMessage}` }), { status: 500 });
  }
}