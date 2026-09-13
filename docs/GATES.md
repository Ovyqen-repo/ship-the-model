# Gates — what to type

Complete these from the handbook + this repo. Capstone has no solution here.

## Gate 1 — basic AI

```bash
npm install && cp .env.example .env.local && npm run dev
```

- Sign in. Send `hi`. Tokens stream.
- Empty send → 400.
- Provider `anthropic` → 400 Unknown provider.
- `DISABLE_GENERATION=1` restart → 503.

## Gate 2 — application AI

- Refresh after a chat. Rows exist in `data/astra.db`.
- Body `userId: "admin"` → 400.
- `POST /api/feedback` with `{ "answer": "I led a team of four." }` → JSON score 1–5.
- Ask for weather → weather tool may run.
- Ask to delete a knowledge base without `confirm: true` in the body → tool returns Confirmation required.

## Gate 3 — grounded AI

Follow `docs/RAG.md`. Page-3 refund question cites `policy.pdf — page 3`. Unsupported question refuses. Second Clerk user does not see the first user's chunks.

## Gate 4 — production AI

Follow `docs/DEPLOY.md` in order. Rate limit is a host step, not a hidden file. Kill switch is `DISABLE_GENERATION=1`.

## Capstone

`docs/CAPSTONE.md` + `checklists/capstone.md`. Close the book.
