# 016 — Reddit text post publishing

## Status
Accepted

## Context

reddit-studio publishes markdown self-posts to Reddit via the OAuth API. city-nonprofits-express builds post content; reddit-studio-express owns OAuth tokens and `POST /api/submit`.

## Decision

### Express (`reddit-studio-express-server`)

- Publish logic lives in `src/services/reddit/`:
  - `router.ts` — `createRedditRouter()`
  - `routes/post-publish-text-post-handler.ts` — thin handler per ADR 002
  - `process-publish-text-post.ts` — Reddit `/api/submit` with `kind=self`
  - `process-refresh-reddit-access-token.ts` — refresh token grant via data layer
- OAuth connect: `routes/get-oauth-start-handler.ts`, `routes/get-oauth-callback-handler.ts`
- Supabase via managed client (`src/services/managed/`), initialized at bootstrap.
- Route: `POST /api/reddit/publish-text-post`
- **No** cron secret on publish handlers (MVP).

### Auth (MVP)

- Publish HTTP endpoints are open for local/OSS server-to-server use (city-nonprofits-express proxy).
- `REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET`, refresh tokens in Supabase remain server-only.
- **Follow-up:** Bearer/session auth on publish before public production deploy.

### Wire contract

Success (flat, like Instagram publish):

```json
{ "success": true, "postId": "t3_...", "permalink": "https://www.reddit.com/r/.../comments/..." }
```

Error:

```json
{ "success": false, "error": "..." }
```

### CORS

Express allows `http://localhost:3000` and optional `NEXT_PUBLIC_WEB_ORIGIN`.

## Related

- ADR 019 — Business account tenancy
- ADR 004 — Managed clients
