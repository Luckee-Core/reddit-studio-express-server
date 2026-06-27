# Release — Luckee-Core

## Publish checklist

1. Commit all OSS readiness changes on `main` in both repos.
2. Create public repos under [Luckee-Core](https://github.com/Luckee-Core) (if not already):
   - `reddit-studio-express-server`
   - `reddit-studio`
3. Push both repos and set descriptions + topics (`reddit`, `open-source`, `nextjs`, `express`).
4. Tag releases (same date for the pair):

```bash
# Express
git tag -a v1.0.0 -m "First public OSS release"
git push origin v1.0.0

# Web
git tag -a v0.1.0 -m "First public OSS release"
git push origin v0.1.0
```

5. Create GitHub releases from tags; link companion repo in release notes.
6. Run governance audit per [mentorai-server data/open-source](https://github.com/Luckee-Core/mentorai-server/blob/main/data/open-source/README.md).

## Pair versions

| Repo | Tag | Notes |
|------|-----|-------|
| reddit-studio-express-server | v1.0.0 | API + `GET /api-docs.json` |
| reddit-studio | v0.1.0 | Web + landing + `/docs/api` |
