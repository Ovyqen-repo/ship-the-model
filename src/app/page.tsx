import { SignedIn, SignedOut } from "@clerk/nextjs";
import AuthBar from "@/components/auth-bar";
import ChatPanel from "@/components/chat-panel";

export default function Page() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 20px" }}>
      <AuthBar />
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
      <SignedIn>
        <ChatPanel />
      </SignedIn>
    </main>
  );
}
