import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
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

/**
 * Resolve a model on the server. Never import this file from a Client Component.
 * Unknown ids throw UnknownProviderError — the route turns that into HTTP 400
 * without leaking keys or internals.
 */
export function resolveModel(provider?: string) {
  const id = (provider ?? "google").toLowerCase();

  if (id === "openai") {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is missing on the server.");
    }
    return openai("gpt-4.1-mini");
  }

  if (id === "google" || id === "gemini") {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing on the server.");
    }
    return google("gemini-2.5-flash");
  }

  throw new UnknownProviderError(id);
}
