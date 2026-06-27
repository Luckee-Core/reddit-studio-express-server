# 009 – Entity routers in `src/data/`

Reddit Studio Express places **HTTP handlers** for business accounts alongside CRUD in `src/data/business-accounts/`.

## Layout

```text
src/data/
  business-accounts/
    get-list-handler.ts    # GET /api/data/business-account/list
    router.ts
src/services/
  reddit/                  # OAuth + publish routes
```

## Why

Business account list is a thin read endpoint colocated with the table folder. Reddit OAuth and publish live in `src/services/reddit/` per ADR 016.

## Wire contract

Documented in [docs/oss/wire-contract.md](../../docs/oss/wire-contract.md).
