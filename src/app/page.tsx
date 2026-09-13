import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import ChatPanel from "@/components/chat-panel";

export default function Page() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ letterSpacing: "0.12em", fontSize: 12, color: "#0F766E" }}>
          SHIP THE MODEL · ASTRA v9
        </p>
        <SignedOut>
          <SignInButton mode="modal">
            <button
              type="button"
              style={{
                padding: "8px 12px",
                border: 0,
                borderRadius: 6,
                background: "#0B1F33",
                color: "white",
              }}
            >
              Sign in
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
      <h1 style={{ fontSize: 32, margin: "8px 0 12px" }}>Astra</h1>
      <p style={{ color: "#57534E", lineHeight: 1.5 }}>
        Session user owns the thread and the knowledge base. The route ignores any
        userId the browser sends. Ingest text at POST /api/ingest.
      </p>
      <SignedOut>
        <p style={{ color: "#9F1239" }}>
          Sign in to chat unless ALLOW_ANON=1 is set for Chapter 2 drills.
        </p>
      </SignedOut>
      <ChatPanel />
    </main>
  );
}
