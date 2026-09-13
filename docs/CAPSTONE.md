# Capstone — Build your own production AI app

Customer-support assistant. **No solution is printed here.**

Use the handbook acceptance list in `checklists/capstone.md`.

## Required

- Next.js App Router
- Streaming chat + Stop
- Clerk (or equivalent) session on every model and retrieve route
- Persisted conversations and messages
- Structured output for at least one screen
- RAG ingest + citations + refusal
- One read-only tool
- One destructive action that needs UI confirm *and* server authorization
- Rate limit + cost cap
- Golden eval set
- Traces without secrets
- Production deploy + kill switch

## Functional

User can sign in, create a conversation, persist messages, stream replies, upload/ingest documents, see sources, get a refusal when evidence is missing, run tools.

## Security

No client secrets. Session user only. Isolated rows. Redacted logs. Request and token limits.

## Quality

Schema tests, retrieval tests, tool tests, error handling.

Close the book. Build it.
