import { requireUserId, UnauthorizedError } from "@/lib/auth";
import { db } from "@/lib/db";
import { getOrCreateConversation, listMessages } from "@/lib/thread";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const userId = await requireUserId();
    const rows = db()
      .prepare(
        "SELECT id, created_at AS createdAt FROM conversations WHERE user_id = ? ORDER BY created_at DESC",
      )
      .all(userId);
    return Response.json({ conversations: rows });
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return Response.json({ error: "Unauthorized." }, { status: 401 });
    }
    throw err;
  }
}

export async function POST(req: Request) {
  try {
    const userId = await requireUserId();
    const body = await req.json().catch(() => null);
    const conversation = getOrCreateConversation(userId, body?.conversationId);
    const messages = listMessages(userId, conversation.id);
    return Response.json({ conversation, messages });
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return Response.json({ error: "Unauthorized." }, { status: 401 });
    }
    return Response.json({ error: "Conversation not found." }, { status: 404 });
  }
}
