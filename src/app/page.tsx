import ChatPanel from "@/components/chat-panel";

export default function Page() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 20px" }}>
      <p style={{ letterSpacing: "0.12em", fontSize: 12, color: "#0F766E" }}>
        SHIP THE MODEL · ASTRA v2
      </p>
      <h1 style={{ fontSize: 32, margin: "8px 0 12px" }}>Astra</h1>
      <p style={{ color: "#57534E", lineHeight: 1.5 }}>
        Streaming chat with a server-side provider factory. Switch Gemini or
        OpenAI mid-thread. Keys stay on the server. Unknown provider ids return
        400.
      </p>
      <ChatPanel />
    </main>
  );
}
