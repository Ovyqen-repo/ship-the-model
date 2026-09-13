import { readFile } from "node:fs/promises";
import path from "node:path";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { requireUserId, UnauthorizedError } from "@/lib/auth";
import { resolveModel, UnknownProviderError } from "@/lib/models";
import { retrieve } from "@/lib/rag";
import { appendMessage, getOrCreateConversation } from "@/lib/thread";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

function textFromMessage(message: UIMessage | undefined) {
  if (!message) return "";
  if (typeof (message as { content?: unknown }).content === "string") {
    return (message as { content: string }).content;
  }
  return (message.parts ?? [])
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("");
}

function publicError(error: unknown) {
  console.error("[astra /api/chat]", error);
  if (error == null) return "unknown error";
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  return JSON.stringify(error);
}

async function systemPrompt(retrieved: string) {
  const file = path.join(process.cwd(), "src/prompts/astra/v0.1.md");
  const base = await readFile(file, "utf8");
  if (!retrieved) return base;
  return `${base}\n\nRETRIEVED PASSAGES\n${retrieved}\nUse only these passages for facts. If they are empty, say you do not know.`;
}

export async function POST(req: Request) {
  if (process.env.DISABLE_GENERATION === "1") {
    return Response.json({ error: "Generation is disabled." }, { status: 503 });
  }

  let userId: string;
  try {
    userId = await requireUserId();
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return Response.json({ error: "Unauthorized." }, { status: 401 });
    }
    throw err;
  }

  const body = await req.json().catch(() => null);
  const incoming = body?.messages as UIMessage[] | undefined;
  const provider = body?.provider;
  const postedUserId = body?.userId;
  if (postedUserId && postedUserId !== userId) {
    return Response.json(
      { error: "Client userId is ignored. Use the session." },
      { status: 400 },
    );
  }

  if (!Array.isArray(incoming) || incoming.length === 0) {
    return Response.json({ error: "Empty body." }, { status: 400 });
  }

  const lastText = textFromMessage(incoming[incoming.length - 1]).trim();
  if (!lastText) {
    return Response.json({ error: "Empty body." }, { status: 400 });
  }

  let conversation;
  try {
    conversation = getOrCreateConversation(userId, body?.conversationId);
    appendMessage(userId, conversation.id, "user", lastText);
  } catch {
    return Response.json({ error: "Conversation not found." }, { status: 404 });
  }

  const hits = retrieve(userId, lastText);
  const retrieved = hits
    .map((h, i) => `[${i + 1}] ${h.title} — page ${h.page}\n${h.text}`)
    .join("\n\n");

  let model;
  try {
    model = resolveModel(provider);
  } catch (err) {
    if (err instanceof UnknownProviderError) {
      return Response.json({ error: "Unknown provider." }, { status: 400 });
    }
    const message = err instanceof Error ? err.message : "Model is not configured.";
    return Response.json({ error: message }, { status: 500 });
  }

  const modelMessages = await convertToModelMessages(incoming);

  const result = streamText({
    model,
    system: await systemPrompt(retrieved),
    messages: modelMessages,
    onFinish: ({ text }) => {
      if (text) appendMessage(userId, conversation.id, "assistant", text);
    },
  });

  return result.toUIMessageStreamResponse({
    originalMessages: incoming,
    headers: { "x-conversation-id": conversation.id },
    onError: publicError,
  });
}
