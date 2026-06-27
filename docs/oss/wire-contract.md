# Wire contract — Reddit Studio (web + Express)

Paired repos:

| Role | Repo | Default port |
|------|------|--------------|
| Web (Next.js) | [reddit-studio](https://github.com/Luckee-Core/reddit-studio) | 3000 |
| API (Express) | [reddit-studio-express-server](https://github.com/Luckee-Core/reddit-studio-express-server) | 3010 |

Governance template: [mentorai-server oss-web-express-wire-contract.md §11](https://github.com/Luckee-Core/mentorai-server/blob/main/data/open-source/oss-web-express-wire-contract.md).

## Proxy pattern

**Same-origin Next rewrites** — browser calls `/api/reddit/*` and `/api/data/*` on the Next host; Next forwards to `EXPRESS_API_URL`. Production builds require `EXPRESS_API_URL`.

## Environment — web

| Variable | Client-visible? | Required | Purpose |
|----------|-----------------|----------|---------|
| `EXPRESS_API_URL` | No | **Yes (production)** | Next rewrite target to Express |
| `NEXT_PUBLIC_API_URL` | Yes | No | Leave empty for same-origin rewrites |

## Environment — Express

| Variable | Required | Purpose |
|----------|----------|---------|
| `PORT` | No (default 3010) | Listen port |
| `SUPABASE_URL` | Yes | Database |
| `SUPABASE_SERVICE_KEY` | Yes | Server-side Supabase client |
| `REDDIT_CLIENT_ID` | Yes | Reddit app |
| `REDDIT_CLIENT_SECRET` | Yes | Reddit app |
| `REDDIT_OAUTH_REDIRECT_URI` | Yes | Must match Reddit app settings |
| `REDDIT_USER_AGENT` | Yes | Reddit API user agent string |
| `REDDIT_OAUTH_WEB_ORIGIN` | Rec | OAuth return redirect to web (`/settings-reddit`) |
| `NEXT_PUBLIC_WEB_ORIGIN` | Rec | CORS + OAuth fallback |

## JSON envelopes

| Context | Shape |
|---------|-------|
| `/api/data/*` success | `{ success: true, data }` |
| `/api/data/*` error | `{ success: false, error: string }` |
| `GET /api/health` | `{ status, message, timestamp, environment }` |
| `GET /api-docs.json` | `{ success: true, data: ApiDocsCatalog }` |
| Publish success (flat) | `{ success: true, postId, permalink }` |
| Publish error | `{ success: false, error: string }` |

## HTTP routing

### Browser → Next → Express

```text
/api/data/business-account/list
/api/reddit/oauth/start-url
/api/reddit/oauth/callback
/api/reddit/publish-text-post
/api/health
/api-docs.json
```

### Tenancy header

`X-Business-Account-Id: <uuid>` on scoped routes (publish, oauth start-url).

## Auth (OSS default)

None on publish v1. Bind Express to localhost or add auth before internet exposure.
