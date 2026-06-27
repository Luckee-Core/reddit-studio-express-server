# Security Policy

## Supported versions

| Version | Supported |
|---------|-----------|
| 1.x     | Yes       |

## Reporting a vulnerability

Email security reports via a [GitHub Security Advisory](https://github.com/Luckee-Core/reddit-studio-express-server/security/advisories/new). Do not open public issues for undisclosed vulnerabilities.

## Scope and threat model

**Reddit Studio Express Server** is designed for **local-first or trusted-network** deployment:

- v1 has **no authentication** on `POST /api/reddit/publish-text-post` — anyone who can reach the API can publish if OAuth is connected for a tenant.
- `REDDIT_CLIENT_SECRET` and refresh tokens in Supabase must never reach browsers.
- `SUPABASE_SERVICE_KEY` grants full database access — server-only.

### Safe defaults (development)

- Express binds localhost-friendly CORS for `http://localhost:3000`.
- Pair with [reddit-studio](https://github.com/Luckee-Core/reddit-studio); browser calls same-origin `/api/*` via Next rewrites.

### Production expectations

If you expose Express beyond localhost:

1. Add Bearer or network isolation on publish routes before public deploy.
2. Set `NEXT_PUBLIC_WEB_ORIGIN` / `REDDIT_OAUTH_WEB_ORIGIN` for CORS and OAuth return URLs.
3. Rotate Reddit app secret and Supabase keys if compromised.

### Out of scope

- Multi-tenant SaaS hardening without operator-added auth

## CORS

Default allows localhost web origin. Set `NEXT_PUBLIC_WEB_ORIGIN` when the Next app runs on another host.
