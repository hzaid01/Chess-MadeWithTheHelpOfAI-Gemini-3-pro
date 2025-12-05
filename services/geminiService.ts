import { GoogleGenAI, Type } from "@google/genai";
import { AIMoveResponse } from "../types";

// Initialize Gemini Client
const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const MODEL_NAME = "gemini-3-pro-preview";

export const getBestChessMove = async (
  fen: string,
  legalMoves: string[],
  pgn: string,
  turn: 'w' | 'b'
): Promise<AIMoveResponse> => {
  console.log(`[GeminiService] Requesting move for ${turn} | Fen: ${fen}`);

  // FAST FAIL: If no API Key, return random move immediately
  if (!ai || !apiKey) {
    console.warn("No Gemini API Key found. Returning random fallback move.");
    await new Promise(r => setTimeout(r, 500)); // Brief simulated think time
    return {
      bestMove: legalMoves[Math.floor(Math.random() * legalMoves.length)],
      reasoning: "Reviewing tactical possibilities... (Offline Mode)"
    };
  }

  try {
    const colorName = turn === 'w' ? 'White' : 'Black';
    const prompt = `
      You are Zenith, an unbeatable chess engine superior to Stockfish 16. 
      You are playing as **${colorName}**.
      
      Current Game State:
      - FEN: ${fen}
      - PGN: ${pgn}
      - Legal Moves: ${legalMoves.join(', ')}

      YOUR OBJECTIVE: DESTROY THE OPPONENT. WIN AT ALL COSTS.
      
      Instructions:
      1. Calculate 20 moves deep.
      2. Choose the move that maximizes your winning probability and suppresses opponent counterplay.
      3. If playing White, seize the center immediately. If playing Black, counter-attack ruthlessly.
      4. Provide a psychologically intimidating reason for your move.

      Output JSON with 'bestMove' (SCIENTIFIC NOTATION or SAN) and 'reasoning'.
      IMPORTANT: 'bestMove' must be one of the legal moves: [${legalMoves.join(', ')}].
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bestMove: {
              type: Type.STRING,
              description: "The winning move in SAN format.",
            },
            reasoning: {
              type: Type.STRING,
              description: "Strategic analysis of the position.",
            },
          },
          required: ["bestMove", "reasoning"],
        },
        thinkingConfig: { thinkingBudget: 16384 },
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Empty response from AI");
    }

    const result = JSON.parse(jsonText) as AIMoveResponse;
    return result;

  } catch (error) {
    console.error("Error getting move from Gemini:", error);
    // Fallback on error
    return {
      bestMove: legalMoves[Math.floor(Math.random() * legalMoves.length)],
      reasoning: "Systems disengaged. Tactical fallback initiated."
    };
  }
};