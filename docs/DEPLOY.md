# Deploy Astra

Walk this in order. Do not skip env verification.

## 1. Push to GitHub

```bash
git push origin main
```

Repo: https://github.com/Ovyqen-repo/ship-the-model

## 2. Create the host project

Vercel (or any Node 22 host). Import the repo. Framework preset: Next.js.

**Figure A — Import screen.** Select the `ship-the-model` repository. Root directory stays `/`.

## 3. Environment variables

Set these as *server* env vars. Never mark secrets as "expose to browser" except the Clerk publishable key.

```
GEMINI_API_KEY=
OPENAI_API_KEY=          # optional
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
DISABLE_GENERATION=0
ALLOW_ANON=0
DATABASE_PATH=/var/tmp/astra.db   # or a mounted volume / Postgres later
```

**Figure B — Env screen.** You should see `CLERK_SECRET_KEY` *without* a `NEXT_PUBLIC_` prefix. If a secret has that prefix, stop and delete it.

## 4. Verify server-only secrets

Open the built client bundle search for `sk_live` / `AIza`. If a hit exists, the key leaked. Fix before traffic.

## 5. Deploy

Trigger production. Wait for the host health check.

## 6. Test production chat

Sign in. Send one sentence. Tokens must appear before the paragraph finishes. Refresh. The thread must still exist if the host volume persisted.

**Figure C — Signed-in chat.** Provider select + thread id prefix visible. Sign-out button from Clerk UserButton.

## 7. Inspect logs

Find `request` rows. Confirm no raw document text and no API keys.

## 8. Rate limits

Add a host-level or Upstash limiter before a public launch. The kit does not ship an open token tap.

## 9. Domain

Attach the domain in the host and in the Clerk dashboard allowed origins.

## 10. Failure behavior

Revoke `GEMINI_API_KEY` in a preview deploy. The UI must show the error state, not a blank hang.

## 11. Kill switch

Set `DISABLE_GENERATION=1`. POST /api/chat returns 503.

## 12. Roll back

Redeploy the previous production deployment. Confirm chat works. Then restore the key.

SQLite on a serverless host is ephemeral. Capstone production should move `src/lib/db.ts` to Postgres or Upstash. The schema stays the same six tables.
