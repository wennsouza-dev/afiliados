
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Crie uma descrição de venda atraente, curta (máximo 300 caracteres) e profissional em português para o seguinte produto: "${productName}" da categoria "${category}". Fale sobre os benefícios principais.`,
    });
    return response.text || "Descrição não disponível no momento.";
  } catch (error) {
    console.error("Error generating description:", error);
    return "Erro ao gerar descrição. Por favor, tente novamente.";
  }
};
