import { GoogleGenAI } from "@google/genai";
import type { Message } from './types';

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

export const sendMessageToModel = async (history: Message[]): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: history,
        config: {
            systemInstruction,
        }
    });
    return response.text;
};
