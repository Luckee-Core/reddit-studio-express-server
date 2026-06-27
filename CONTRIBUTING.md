# Contributing

Thank you for contributing to **Reddit Studio Express Server**.

## Before you code

1. Read [`.cursor/rules/AGENTS.md`](.cursor/rules/AGENTS.md).
2. Read relevant ADRs under [`.cursor/architecture/`](.cursor/architecture/README.md).
3. CRUD in `src/data/{table}/`; Reddit HTTP in `src/services/reddit/`.
4. For OSS governance context, see [mentorai-server `data/open-source/README.md`](https://github.com/Luckee-Core/mentorai-server/blob/main/data/open-source/README.md).

## Pull requests

1. Fork the repo and create a feature branch from `main`.
2. Update `docs/oss/wire-contract.md` when routes or env vars change.
3. Run `npm run build` before opening a PR.
4. Describe what changed and how you tested it.

## Code style

- Use `type`, not `interface`.
- Router factories (`createXRouter()`), one handler per file.
- Emoji logging prefixes per ADR 006.

## Questions

Open a GitHub issue for bugs or feature discussion before large refactors.
