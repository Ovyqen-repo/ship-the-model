import { db } from "./db";

export type Role = "user" | "assistant" | "system";

export function getOrCreateConversation(userId: string, conversationId?: string) {
  if (!userId) throw new Error("userId is required from the session.");
  const conn = db();
  if (conversationId) {
    const row = conn
      .prepare("SELECT id, user_id AS userId, created_at AS createdAt FROM conversations WHERE id = ?")
      .get(conversationId) as { id: string; userId: string; createdAt: string } | undefined;
    if (!row || row.userId !== userId) throw new Error("Conversation not found.");
    return row;
  }
  const created = {
    id: crypto.randomUUID(),
    userId,
    createdAt: new Date().toISOString(),
  };
  conn.prepare("INSERT INTO conversations (id, user_id, created_at) VALUES (?, ?, ?)").run(
    created.id,
    created.userId,
    created.createdAt,
  );
  return created;
}

export function appendMessage(
  userId: string,
  conversationId: string,
  role: Role,
  content: string,
) {
  const convo = getOrCreateConversation(userId, conversationId);
  const row = {
    id: crypto.randomUUID(),
    conversationId: convo.id,
    role,
    content,
    createdAt: new Date().toISOString(),
  };
  db()
    .prepare(
      "INSERT INTO messages (id, conversation_id, user_id, role, content, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    )
    .run(row.id, row.conversationId, userId, row.role, row.content, row.createdAt);
  return row;
}

export function listMessages(userId: string, conversationId: string) {
  getOrCreateConversation(userId, conversationId);
  return db()
    .prepare(
      "SELECT id, conversation_id AS conversationId, role, content, created_at AS createdAt FROM messages WHERE conversation_id = ? AND user_id = ? ORDER BY created_at ASC",
    )
    .all(conversationId, userId) as {
    id: string;
    conversationId: string;
    role: Role;
    content: string;
    createdAt: string;
  }[];
}
