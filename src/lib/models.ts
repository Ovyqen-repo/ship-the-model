import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Resolve a model on the server. Never import this file from a Client Component.
 */
export function resolveModel(provider?: string) {
  if (provider === "openai") {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is missing on the server.");
    }
    return openai("gpt-4.1-mini");
  }
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing on the server.");
  }
  return google("gemini-2.5-flash");
}
