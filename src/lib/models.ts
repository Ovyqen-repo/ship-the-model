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

export const PROVIDERS = ["openai", "google"] as const;
export type ProviderId = (typeof PROVIDERS)[number];

export class UnknownProviderError extends Error {
  constructor(provider: string) {
    super("Unknown provider.");
    this.name = "UnknownProviderError";
    this.cause = provider;
  }
}

export function resolveModel(provider?: string) {
  const id = (provider ?? "openai").toLowerCase();

  if (id === "openai" || id === "luna") {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is missing on the server.");
    }
    // Cheap high-volume default. Flagship is gpt-6-astra — not the product name.
    return openai("gpt-5.6-luna");
  }

  if (id === "google" || id === "gemini") {
    if (!googleKey()) {
      throw new Error("GEMINI_API_KEY is missing on the server.");
    }
    return google("gemini-3.6-flash");
  }

  throw new UnknownProviderError(id);
}
