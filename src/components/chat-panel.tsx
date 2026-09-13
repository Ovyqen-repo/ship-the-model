"use client";

import { useChat } from "@ai-sdk/react";
import { FormEvent, useEffect, useState } from "react";

const PROVIDERS = [
  { id: "google", label: "Gemini" },
  { id: "openai", label: "OpenAI" },
] as const;

export default function ChatPanel() {
  const [provider, setProvider] = useState<(typeof PROVIDERS)[number]["id"]>(
    "google",
  );
  const [conversationId, setConversationId] = useState<string>();
  const { messages, sendMessage, status, stop } = useChat();
  const [input, setInput] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/conversations", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{}",
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data?.conversation?.id) {
          setConversationId(data.conversation.id);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    await sendMessage(
      { text },
      { body: { provider, conversationId } },
    );
  }

  const busy = status === "submitted" || status === "streaming";

  return (
    <section style={{ marginTop: 28 }}>
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          marginBottom: 10,
          fontSize: 13,
          color: "#57534E",
          flexWrap: "wrap",
        }}
      >
        <label htmlFor="provider">Provider</label>
        <select
          id="provider"
          value={provider}
          onChange={(e) =>
            setProvider(e.target.value as (typeof PROVIDERS)[number]["id"])
          }
          disabled={busy}
          style={{
            padding: "6px 8px",
            borderRadius: 6,
            border: "1px solid #D6D3D1",
            background: "white",
          }}
        >
          {PROVIDERS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
        <span>Thread {conversationId ? conversationId.slice(0, 8) : "…"}</span>
      </div>
      <div
        style={{
          minHeight: 280,
          border: "1px solid #E7E0D6",
          borderRadius: 8,
          padding: 16,
          background: "#FFFcf8",
        }}
      >
        {messages.length === 0 && (
          <p style={{ color: "#78716C" }}>Waiting for the first message.</p>
        )}
        {messages.map((m) => (
          <article key={m.id} style={{ marginBottom: 14 }}>
            <strong>{m.role === "user" ? "You" : "Astra"}</strong>
            <div style={{ whiteSpace: "pre-wrap", marginTop: 4 }}>
              {m.parts
                ?.map((part) => (part.type === "text" ? part.text : ""))
                .join("")}
            </div>
          </article>
        ))}
        {busy && (
          <p style={{ color: "#0F766E", fontSize: 13 }}>Streaming…</p>
        )}
        {status === "error" && (
          <p style={{ color: "#9F1239", fontSize: 13 }}>
            The route refused the request. Sign in, check the key, or inspect the status code.
          </p>
        )}
      </div>
      <form onSubmit={onSubmit} style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Astra something"
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 6,
            border: "1px solid #D6D3D1",
          }}
        />
        {busy ? (
          <button
            type="button"
            onClick={() => stop()}
            style={{
              padding: "10px 16px",
              border: 0,
              borderRadius: 6,
              background: "#9F1239",
              color: "white",
            }}
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            style={{
              padding: "10px 16px",
              border: 0,
              borderRadius: 6,
              background: "#0B1F33",
              color: "white",
            }}
          >
            Send
          </button>
        )}
      </form>
    </section>
  );
}
