import { z } from "zod";

/** Structured interview feedback — Chapter 4. */
export const Feedback = z.object({
  score: z.number().min(1).max(5),
  strengths: z.array(z.string()).max(3),
  weaknesses: z.array(z.string()).max(3),
  nextQuestion: z.string(),
});

export type Feedback = z.infer<typeof Feedback>;
