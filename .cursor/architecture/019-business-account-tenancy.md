# 019 — Business account tenancy

## Status
Accepted

## Context

Express serves multiple Reddit publishing tenants. OAuth refresh tokens live in `reddit_oauth_connections`; tenant metadata in `business_accounts`.

## Decision

### Data

- `business_accounts` — slug, label, reddit_username, sort_order (shared with Instagram Studio when using one Supabase)
- `reddit_oauth_connections` — one row per business account (refresh_token, cached access_token, expires_at)

### Request contract

Header `X-Business-Account-Id` required on scoped routes. Helper: `requireBusinessAccountIdFromRequest(req)` in `src/utils/business-account/`.

### OAuth resolution

1. Load `reddit_oauth_connections` by `business_account_id`
2. Refresh access token when expired via Reddit token endpoint
3. Use access token for `POST https://oauth.reddit.com/api/submit`

Reddit app credentials (`REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET`) stay in env only.

## Related

- ADR 016 — Reddit text post publishing
- Web ADR 013 (reddit-studio)
