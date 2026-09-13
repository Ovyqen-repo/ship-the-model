import { tool } from "ai";
import { z } from "zod";

/**
 * Read-only tool. Safe to auto-run when a session exists.
 * Confirmation is not required. Authorization still is.
 */
export const weatherTool = tool({
  description: "Get a short weather summary for a city.",
  inputSchema: z.object({
    city: z.string().min(1).max(80),
  }),
  execute: async ({ city }) => {
    return { city, summary: "Demo weather. Replace with a real provider." };
  },
});

/**
 * Destructive tool. The model may request it.
 * execute checks confirm from the *route*, not from model-invented args.
 */
export function deleteKnowledgeBaseTool(opts: {
  userId: string;
  confirmFromRoute: boolean;
}) {
  return tool({
    description: "Delete a knowledge base the signed-in user owns.",
    inputSchema: z.object({
      knowledgeBaseId: z.string().min(1),
      confirm: z.boolean().optional(),
    }),
    execute: async ({ knowledgeBaseId }) => {
      if (!opts.userId) {
        return { ok: false, error: "Unauthorized." };
      }
      if (!opts.confirmFromRoute) {
        return { ok: false, error: "Confirmation required." };
      }
      return {
        ok: true,
        knowledgeBaseId,
        note: "Stub. Wire ownership check before this becomes real.",
      };
    },
  });
}
