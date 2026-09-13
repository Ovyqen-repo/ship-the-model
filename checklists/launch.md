# Launch checklist

- [ ] Keys are server-only. `.env.local` is gitignored.
- [ ] Model route is dynamic. Responses stream.
- [ ] Empty input is rejected. Max duration is set.
- [ ] Auth is on before the URL is public.
- [ ] System prompt lives in versioned source.
- [ ] A kill switch exists (`DISABLE_GENERATION`).
