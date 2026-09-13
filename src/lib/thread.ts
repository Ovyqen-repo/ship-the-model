/**
 * Server-owned conversation contract — Chapter 4.
 * React state is display. This is truth.
 *
 * User
 *  └── Conversation
 *        └── Message
 *
 * Never accept userId from the browser when a session exists.
 */

export type Role = "user" | "assistant" | "system";

export type ThreadMessage = {
  id: string;
  conversationId: string;
  role: Role;
  content: string;
  createdAt: string;
};

export type Conversation = {
  id: string;
  userId: string;
  createdAt: string;
};

const conversations = new Map<string, Conversation>();
const messages = new Map<string, ThreadMessage[]>();

export function getOrCreateConversation(userId: string, conversationId?: string) {
  if (!userId) throw new Error("userId is required from the session.");
  if (conversationId) {
    const existing = conversations.get(conversationId);
    if (!existing || existing.userId !== userId) {
      throw new Error("Conversation not found.");
    }
    return existing;
  }
  const created: Conversation = {
    id: crypto.randomUUID(),
    userId,
    createdAt: new Date().toISOString(),
  };
  conversations.set(created.id, created);
  messages.set(created.id, []);
  return created;
}

export function appendMessage(
  userId: string,
  conversationId: string,
  role: Role,
  content: string,
) {
  const convo = conversations.get(conversationId);
  if (!convo || convo.userId !== userId) {
    throw new Error("Conversation not found.");
  }
  const row: ThreadMessage = {
    id: crypto.randomUUID(),
    conversationId,
    role,
    content,
    createdAt: new Date().toISOString(),
  };
  const list = messages.get(conversationId) ?? [];
  list.push(row);
  messages.set(conversationId, list);
  return row;
}

export function listMessages(userId: string, conversationId: string) {
  const convo = conversations.get(conversationId);
  if (!convo || convo.userId !== userId) {
    throw new Error("Conversation not found.");
  }
  return messages.get(conversationId) ?? [];
}
