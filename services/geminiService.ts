import { GoogleGenAI } from "@google/genai";

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY is not defined");
    }
    return new GoogleGenAI({ apiKey });
};

export const improveMarkdown = async (markdown: string, instruction: string): Promise<string> => {
    try {
        const ai = getClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are an expert technical writer and markdown editor. 
            
            User Instruction: ${instruction}
            
            Current Markdown Content:
            ${markdown}
            
            Please return ONLY the improved/corrected Markdown content. Do not add conversational text.`,
            config: {
                systemInstruction: "You are a helpful assistant that improves markdown formatting, fixes grammar, and enhances clarity.",
            }
        });

        return response.text || markdown;
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
};
