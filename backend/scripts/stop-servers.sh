#!/usr/bin/env bash
# Stop local dev servers without pkill self-matching.
# Usage: ./backend/scripts/stop-servers.sh

set -e

echo "Stopping any running uvicorn app.main..."
pkill -f "[u]vicorn app.main" 2>/dev/null || echo "  (none running)"

echo "Stopping any running streamlit run..."
pkill -f "[s]treamlit run" 2>/dev/null || echo "  (none running)"

sleep 1

echo
echo "Remaining relevant processes:"
ps aux | grep -E "[u]vicorn|[s]treamlit" || echo "  (none)"
