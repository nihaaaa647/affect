"use server";

import { ImpactData } from "./types";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Module-level cache to avoid repeated AI calls for the same article/profile combo
const impactCache: Record<string, ImpactData> = {};

export async function getWalletImpact(prompt: string, articleId: string): Promise<ImpactData> {
  if (impactCache[articleId]) {
    return impactCache[articleId];
  }

  if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not defined");
  }

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://affect.personal.radar", // Optional for OpenRouter
        "X-Title": "Affect App"
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3
      })
    });

    const data = await res.json();
    
    if (data.error) {
       console.error("OpenRouter API Error Details:", JSON.stringify(data.error, null, 2));
       throw new Error(data.error.message || "OpenRouter provider error");
    }

    if (!data.choices || !data.choices[0]) {
       console.error("OpenRouter Response missing choices:", JSON.stringify(data, null, 2));
       throw new Error("Invalid response from OpenRouter");
    }

    const text = data.choices[0].message.content;
    try {
      const clean = text.replace(/```json|```/g, "").trim();
      const impact = JSON.parse(clean) as ImpactData;
      
      impactCache[articleId] = impact;
      return impact;
    } catch (parseError) {
      console.error("Failed to parse OpenRouter JSON:", text);
      throw new Error("AI returned malformed data. Please try again.");
    }
  } catch (error) {
    console.error("Error calling OpenRouter:", error);
    throw error;
  }
}
