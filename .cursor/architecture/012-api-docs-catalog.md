# 012 – API docs catalog

Reddit Studio Express exposes a machine-readable API catalog at `GET /api-docs.json`.

## Shape

```json
{
  "success": true,
  "data": {
    "version": "1.0.0",
    "baseUrl": "http://localhost:3010",
    "responseEnvelope": "...",
    "groups": [ … ]
  }
}
```

## Implementation

| File | Role |
|------|------|
| `src/services/api-docs/api-docs-catalog.ts` | Static catalog builder |
| `src/services/api-docs/router.ts` | Mounts `GET /api-docs.json` |

## Web consumer

[reddit-studio](https://github.com/Luckee-Core/reddit-studio) `/docs/api` fetches `/api-docs.json` via Next rewrite.
