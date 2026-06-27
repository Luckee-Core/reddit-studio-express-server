# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-06-27

### Added

- MIT license, CONTRIBUTING.md, SECURITY.md
- GitHub Actions CI (`npm run build`)
- `GET /api-docs.json` API catalog
- `docs/oss/wire-contract.md` paired with reddit-studio
- ADR 009 (data-layer handlers) and ADR 012 (api-docs catalog)

### Changed

- Health message: product-specific branding
- SQL moved to `docs/sql/`
- README: threat model, companion web links
- Committed `package-lock.json`
- OAuth callback prefers `REDDIT_OAUTH_WEB_ORIGIN` and `/settings-reddit` return path

### Security

- Documented open publish endpoints in v1 and CORS guidance
