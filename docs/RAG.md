# RAG ingest

```bash
curl -X POST http://localhost:3000/api/ingest \
  -H "Content-Type: application/json" \
  --cookie "...clerk session..." \
  -d '{
    "title": "policy.pdf",
    "text": "PAGE 1\nWelcome.\nPAGE 3\nRefunds take fourteen days."
  }'
```

Then ask: "How long do refunds take?"

Checkpoint

- chunk from page 3 is retrieved
- answer cites policy.pdf — page 3
- a question with no passage is refused
- another user's document is not in the retrieve query (filter is `chunks.user_id = session`)

Lexical retrieval ships in v9 so a junior can run without an embedding vendor. Swap `retrieve()` for cosine search when you add vectors. Do not embed a whole PDF as one row.
