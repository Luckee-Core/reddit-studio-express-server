# Reddit Studio Express Server

Express API for **Reddit Studio**: business-account tenancy, Reddit OAuth connect, and markdown self-post publishing.

Open-source pair with [reddit-studio](https://github.com/Luckee-Core/reddit-studio). Governance: [mentorai-server `data/open-source/`](https://github.com/Luckee-Core/mentorai-server/tree/main/data/open-source).

## TL;DR

```bash
git clone https://github.com/Luckee-Core/reddit-studio-express-server.git
cd reddit-studio-express-server
npm install
cp .env.example .env
# Apply docs/sql/001 → 002 in Supabase (see below)
npm run dev
```

Server listens on **port 3010** by default. Pair with [reddit-studio](https://github.com/Luckee-Core/reddit-studio) on port **3000**.

## Supabase SQL (run in order)

| File | Purpose |
|------|---------|
| `docs/sql/001_business_accounts.sql` | Add `reddit_username` column to shared `business_accounts` |
| `docs/sql/002_reddit_oauth_connections.sql` | Create `reddit_oauth_connections` table |

**Note:** `business_accounts` may already exist if you share a Supabase project with other Luckee apps. Run `001` only to add the Reddit column — do not recreate the table.

## Environment

```env
PORT=3010
NODE_ENV=development
SUPABASE_URL=
SUPABASE_SERVICE_KEY=

REDDIT_CLIENT_ID=
REDDIT_CLIENT_SECRET=
REDDIT_OAUTH_REDIRECT_URI=http://localhost:3010/api/reddit/oauth/callback
REDDIT_USER_AGENT=web:reddit-studio-express-server:1.0.0 (by /u/yourusername)

# Where OAuth redirects after connect (reddit-studio web)
REDDIT_OAUTH_WEB_ORIGIN=http://localhost:3000
NEXT_PUBLIC_WEB_ORIGIN=http://localhost:3000
```

## Health check

```bash
curl http://localhost:3010/api/health
```

```json
{
  "status": "ok",
  "message": "Reddit Studio Express Server is running",
  "timestamp": "2026-06-27T12:00:00.000Z",
  "environment": "development"
}
```

## API

| Mount | Purpose |
|-------|---------|
| `GET /api/health` | Health check |
| `GET /api-docs.json` | API documentation catalog |
| `GET /api/data/business-account/list` | List business accounts |
| `GET /api/reddit/oauth/start` | Start OAuth (redirect) |
| `GET /api/reddit/oauth/start-url` | OAuth URL for web connect button |
| `GET /api/reddit/oauth/callback` | Reddit OAuth callback |
| `POST /api/reddit/publish-text-post` | Publish markdown self-post |

Scoped routes require header `X-Business-Account-Id`.

## Threat model

- **v1 has no auth** on publish — open for local/server-to-server use. Add Bearer or network isolation before public deploy.
- `REDDIT_CLIENT_SECRET` and refresh tokens stay server-side in Supabase.
- See [SECURITY.md](./SECURITY.md).

## Wire contract

[docs/oss/wire-contract.md](./docs/oss/wire-contract.md)

## Architecture

Follow **`.cursor/rules/AGENTS.md`** and **`.cursor/architecture/`**.

- Reddit HTTP in `src/services/reddit/`
- Business account list handler in `src/data/business-accounts/` (ADR 009)
- No `src/domains/`
