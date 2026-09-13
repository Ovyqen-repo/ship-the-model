# Ship the Model

Companion repository for **Ship the Model — 2026 Edition** (`edition-2026.09-final`).

Astra **v9 path**: streaming chat, provider factory, Clerk session, SQLite persistence, RAG ingest, tools, structured feedback.

Handbook: https://ovyqen.gumroad.com/  
Repo: https://github.com/ovyqen-repo/ship-the-model

## Setup

```bash
git clone https://github.com/ovyqen-repo/ship-the-model.git
cd ship-the-model
npm install
cp .env.example .env.local
```

Fill `GEMINI_API_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, and `CLERK_SECRET_KEY`.

Chapter 2 only: `ALLOW_ANON=1` skips Clerk so the first chat still runs. Production and capstone leave it at `0`.

```bash
npm run dev
```

Open http://localhost:3000. Sign in. Send a sentence. Tokens stream.

Walk the gates: `docs/GATES.md`. Ingest: `docs/RAG.md`. Deploy: `docs/DEPLOY.md`. Capstone brief (no solution): `docs/CAPSTONE.md`.

## Rules

- Secrets stay on the server.
- `userId` comes from `auth()`, never from the JSON body.
- Confirmation is not authorization. `confirm` is read from the route body, not from tool arguments.
- The model is an untrusted collaborator.
