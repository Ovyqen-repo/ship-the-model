import ChatPanel from "@/components/chat-panel";

export default function Page() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 20px" }}>
      <p style={{ letterSpacing: "0.12em", fontSize: 12, color: "#0F766E" }}>
        SHIP THE MODEL
      </p>
      <h1 style={{ fontSize: 32, margin: "8px 0 12px" }}>Astra</h1>
      <p style={{ color: "#57534E", lineHeight: 1.5 }}>
        Type a sentence. Tokens should appear before the full reply exists.
        Keys stay on the server.
      </p>
      <ChatPanel />
    </main>
  );
}
