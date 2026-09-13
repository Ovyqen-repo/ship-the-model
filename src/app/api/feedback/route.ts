import { generateText, Output } from "ai";
import { requireUserId, UnauthorizedError } from "@/lib/auth";
import { resolveModel } from "@/lib/models";
import { Feedback } from "@/lib/schema";

export const dynamic = "force-dynamic";

/** Chapter 4 structured-output exercise. Not the capstone solution. */
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
  const answer = String(body?.answer ?? "").trim();
  if (!answer) {
    return Response.json({ error: "answer is required." }, { status: 400 });
  }

  try {
    const { output } = await generateText({
      model: resolveModel(body?.provider),
      output: Output.object({ schema: Feedback }),
      prompt: `Score this interview answer for user ${userId}. Return only the schema.\n\n${answer}`,
    });
    return Response.json(output);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Feedback failed.";
    return Response.json({ error: message }, { status: 500 });
  }
}
