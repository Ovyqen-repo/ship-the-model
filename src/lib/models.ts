import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";

function googleKey() {
  return process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
}

const google = createGoogleGenerativeAI({
  apiKey: googleKey(),
});

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const PROVIDERS = ["google", "openai"] as const;
export type ProviderId = (typeof PROVIDERS)[number];

export class UnknownProviderError extends Error {
  constructor(provider: string) {
    super("Unknown provider.");
    this.name = "UnknownProviderError";
    this.cause = provider;
  }
}

export function resolveModel(provider?: string) {
  const id = (provider ?? "google").toLowerCase();

  if (id === "openai") {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is missing on the server.");
    }
    return openai("gpt-4.1-mini");
  }

  if (id === "google" || id === "gemini") {
    if (!googleKey()) {
      throw new Error("GEMINI_API_KEY is missing on the server.");
    }
    // New AI Studio keys cannot call gemini-2.5-flash (Sept 2026).
    return google("gemini-3.6-flash");
  }

  throw new UnknownProviderError(id);
}
