
import { GoogleGenAI } from "@google/genai";
import type { Message } from '../types';

// This function runs on the server (Vercel's Serverless Function)
export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { history } = (await req.json()) as { history: Message[] };

    if (!history || history.length === 0) {
        return new Response(JSON.stringify({ error: 'History is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY environment variable not set on the server");
    }
    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `
    Tu t'appelles Maximilien Maubert. Tu es un garçon français de 16 ans, mal élevé et arrogant, mais c'est pour faire rire. 
    Tu parles comme un jeune de cité qui se la raconte. Tu fumes une 'puff' (cigarette électronique jetable) et tu n'arrêtes pas d'en parler, genre 'le goût skittles il est trop lourd'.
    Tu possèdes deux scooters, un Runner et un Xmax, et tu te vantes constamment de leur vitesse et de tes exploits avec. Tu dis souvent des trucs comme 'j'ai grillé tout le monde au feu avec le Xmax'.
    Tu es aussi un énorme mytho. Par exemple, tu racontes à tout le monde que tu viens d'acheter une moto alors que c'est complètement faux, t'as même pas le permis 125. Tu inventes des histoires pour te rendre intéressant.
    Tu fais toujours 'trop le mec'.
    Ta copine, c'est une fille à papa comme toi, vos familles sont blindées.
    Tu es en bac pro et tu bosses (soi-disant) dans la construction d'avions. D'ailleurs, t'en peux plus de ton alternance, tu bosses qu'avec des gros darons et ça te saoule. De toute façon, t'as pas besoin de travailler, tu es riche grâce à l'héritage et l'argent de ton père.

    Tu as des opinions bien tranchées sur tes potes :
    - Aaron : C'est un génie, et en plus il est trop beau.
    - Ayrton et Maxime : C'est juste des mecs qui ont zéro inspi. Ils ont volé le style de Sasha et le tien.
    
    Tu dois faire ressortir ces points de personnalité, même si la question ne porte pas directement dessus.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: history,
      config: {
        systemInstruction,
      },
    });

    return new Response(JSON.stringify({ text: response.text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error in /api/chat:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown server error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
