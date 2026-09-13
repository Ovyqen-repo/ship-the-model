import { db } from "./db";

const CHUNK = 900;
const OVERLAP = 120;

export function chunkText(text: string) {
  const clean = text.replace(/\r/g, "").trim();
  const pages = clean.split(/\n\s*PAGE\s+\d+\s*\n/i);
  const blocks: { page: number; text: string }[] = [];
  const parts = pages.length > 1 ? pages : [clean];
  parts.forEach((part, idx) => {
    let i = 0;
    const body = part.trim();
    while (i < body.length) {
      const slice = body.slice(i, i + CHUNK).trim();
      if (slice) blocks.push({ page: idx + 1, text: slice });
      i += CHUNK - OVERLAP;
    }
  });
  return blocks;
}

export function ingestDocument(opts: {
  userId: string;
  title: string;
  text: string;
  knowledgeBaseId?: string;
}) {
  const conn = db();
  const kbId = opts.knowledgeBaseId ?? crypto.randomUUID();
  const now = new Date().toISOString();
  const existingKb = conn.prepare("SELECT id FROM knowledge_bases WHERE id = ? AND user_id = ?").get(kbId, opts.userId);
  if (!existingKb) {
    conn
      .prepare("INSERT INTO knowledge_bases (id, user_id, name, created_at) VALUES (?, ?, ?, ?)")
      .run(kbId, opts.userId, opts.title, now);
  } else {
    const owned = conn.prepare("SELECT id FROM knowledge_bases WHERE id = ? AND user_id = ?").get(kbId, opts.userId);
    if (!owned) throw new Error("Knowledge base not found.");
  }
  const docId = crypto.randomUUID();
  conn
    .prepare("INSERT INTO documents (id, knowledge_base_id, user_id, title, created_at) VALUES (?, ?, ?, ?, ?)")
    .run(docId, kbId, opts.userId, opts.title, now);
  const chunks = chunkText(opts.text);
  const insert = conn.prepare(
    "INSERT INTO chunks (id, document_id, user_id, page, text, created_at) VALUES (?, ?, ?, ?, ?, ?)",
  );
  for (const c of chunks) {
    insert.run(crypto.randomUUID(), docId, opts.userId, c.page, c.text, now);
  }
  return { knowledgeBaseId: kbId, documentId: docId, chunks: chunks.length };
}

function score(query: string, text: string) {
  const terms = query.toLowerCase().split(/\W+/).filter((t) => t.length > 2);
  const hay = text.toLowerCase();
  return terms.reduce((n, t) => n + (hay.includes(t) ? 1 : 0), 0);
}

export function retrieve(userId: string, query: string, k = 4) {
  const rows = db()
    .prepare(
      `SELECT chunks.id, chunks.page, chunks.text, documents.title
       FROM chunks
       JOIN documents ON documents.id = chunks.document_id
       WHERE chunks.user_id = ?`,
    )
    .all(userId) as { id: string; page: number; text: string; title: string }[];
  return rows
    .map((r) => ({ ...r, score: score(query, r.text) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
