#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -f .nvmrc ]]; then
  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  if [[ -s "$NVM_DIR/nvm.sh" ]]; then
    # shellcheck source=/dev/null
    . "$NVM_DIR/nvm.sh"
    nvm use
  fi
fi

REQUIRED_MAJOR=22
ACTUAL_MAJOR="$(node -p "process.versions.node.split('.')[0]")"
if (( ACTUAL_MAJOR < REQUIRED_MAJOR )); then
  echo "❌ Node $(node -v) is active; this project requires Node >= ${REQUIRED_MAJOR}." >&2
  echo "   From this directory run: nvm install ${REQUIRED_MAJOR} && nvm use" >&2
  exit 1
fi

exec "$@"
