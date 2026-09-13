import { auth } from "@clerk/nextjs/server";

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized.");
    this.name = "UnauthorizedError";
  }
}

/**
 * Session user only. Ignore any userId the browser posted.
 * ALLOW_ANON=1 is the Chapter 2 training wheels. Capstone leaves it off.
 */
export async function requireUserId() {
  if (process.env.ALLOW_ANON === "1") {
    return "anon-local";
  }
  const { userId } = await auth();
  if (!userId) throw new UnauthorizedError();
  return userId;
}
