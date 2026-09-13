# Ship the Model

Companion repository for **Ship the Model — 2026 Edition**  
Astra from OvyQen

Handbook: sold at [https://ovyqen.gumroad.com/](https://ovyqen.gumroad.com/)  
This repo: [https://github.com/ovyqen-repo/ship-the-model](https://github.com/ovyqen-repo/ship-the-model)

Tag that matches the current PDF: `edition-2026.09`  
This commit is **Astra v2** (streaming + provider swap).

## What this is

A small Next.js App Router starter that matches Chapters 2–3 of the handbook:

- server-only API keys
- `streamText` on `POST /api/chat`
- `useChat` on the client
- provider field resolved by `lib/models.ts`
- unknown provider ids → HTTP 400, no key leakage
- a versioned system prompt file
- `DISABLE_GENERATION=1` kill switch

It is a field kit, not a full clone of every chapter project.

## Tested with (September 2026)

| Package | Version band |
|---|---|
| Next.js | 16.3.x |
| React | 19.x (what App Router ships) |
| Node.js | 22+ |
| `ai` | 5.x–7.x |
| `@ai-sdk/react` | match `ai` major |
| `@ai-sdk/google` | match `ai` major |

Model ids change. Default example: `gemini-2.5-flash`. Confirm the current Flash alias in Google AI Studio.

## Setup

```bash
git clone https://github.com/ovyqen-repo/ship-the-model.git
cd ship-the-model
pnpm install   # or npm install
cp .env.example .env.local
```

Put a Gemini key in `.env.local`. Never prefix it with `NEXT_PUBLIC_`.

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Type a sentence. Tokens should appear before the full paragraph exists. Switch the provider select — history stays, the factory changes.

## Layout

```
src/
  app/
    api/chat/route.ts
    page.tsx
    layout.tsx
  components/chat-panel.tsx
  lib/models.ts
  prompts/astra/v0.1.md
.env.example
checklists/
```

## Architecture rules

- Secrets stay on the server.
- Truth stays in a database or retrieved passages — not in React state.
- Money and permissions stay in deterministic code.
- The model is an untrusted collaborator.

## License

Source in this repository is provided for buyers of the handbook. See `LICENSE`.
