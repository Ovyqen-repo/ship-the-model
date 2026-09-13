import { readFile } from "node:fs/promises";
import path from "node:path";
import { streamText } from "ai";
import { resolveModel } from "@/lib/models";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

async function systemPrompt() {
  const file = path.join(process.cwd(), "src/prompts/astra/v0.1.md");
  return readFile(file, "utf8");
}

export async function POST(req: Request) {
  if (process.env.DISABLE_GENERATION === "1") {
    return Response.json(
      { error: "Generation is disabled." },
      { status: 503 },
    );
  }

  const body = await req.json().catch(() => null);
  const messages = body?.messages;
  const provider = body?.provider;

  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "Empty body." }, { status: 400 });
  }

  const result = streamText({
    model: resolveModel(provider),
    system: await systemPrompt(),
    messages,
  });

  return result.toUIMessageStreamResponse();
}
