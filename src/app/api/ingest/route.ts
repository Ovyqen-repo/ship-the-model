import { requireUserId, UnauthorizedError } from "@/lib/auth";
import { ingestDocument } from "@/lib/rag";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
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
  const title = String(body?.title ?? "").trim();
  const text = String(body?.text ?? "").trim();
  const knowledgeBaseId = body?.knowledgeBaseId
    ? String(body.knowledgeBaseId)
    : undefined;

  if (!title || !text) {
    return Response.json({ error: "title and text are required." }, { status: 400 });
  }

  try {
    const result = ingestDocument({ userId, title, text, knowledgeBaseId });
    return Response.json(result);
  } catch {
    return Response.json({ error: "Knowledge base not found." }, { status: 403 });
  }
}
