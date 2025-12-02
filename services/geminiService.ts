import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
// Note: In a real production app, you might proxy this through a backend to protect the key,
// but for a local tool/demo, env var usage is standard per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const suggestCommand = async (description: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.warn("No API Key provided for Gemini");
    return "npm run dev"; // Fallback
  }

  try {
    const prompt = `
      I am a developer setting up a shortcut for a local project.
      Based on this description: "${description}", suggest a single terminal command to run the project.
      
      Examples:
      "NextJS app" -> "npm run dev"
      "Python Flask" -> "python app.py"
      "Docker compose" -> "docker-compose up"
      "Rust project" -> "cargo run"
      
      Return ONLY the command string, no markdown, no explanation.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || "npm run dev";
  } catch (error) {
    console.error("Gemini suggestion failed:", error);
    return "npm run dev";
  }
};