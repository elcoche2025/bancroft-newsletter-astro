#!/bin/bash
# Make Newsletter — double-click launcher for the G1 weekly newsletter.
#
# Opens a Claude Code session in this directory with:
#   • all CLAUDE.md context auto-loaded (global + coding-projects + this project)
#   • the latest G1 spreadsheet from ~/Downloads attached
#   • the upcoming Monday's date pre-filled
#
# To rebuild the launcher: just edit this file. Re-running chmod is not needed.

set -e

cd "$(dirname "$0")"

# Find the latest "G1 Weekly Newsletter*.xlsx" in Downloads (newest by mtime).
LATEST_XLSX=""
shopt -s nullglob
candidates=("$HOME/Downloads/G1 Weekly Newsletter"*.xlsx)
shopt -u nullglob
if [ "${#candidates[@]}" -gt 0 ]; then
    LATEST_XLSX=$(ls -t "${candidates[@]}" | head -1)
fi

# Compute the upcoming Monday (today if today is Monday).
TARGET_DATE=$(/usr/bin/python3 -c "
import datetime
t = datetime.date.today()
print((t + datetime.timedelta(days=(-t.weekday()) % 7)).isoformat())
")

# Build the seed prompt.
if [ -n "$LATEST_XLSX" ]; then
    PROMPT="It's time to write the 1st grade newsletter for Monday, $TARGET_DATE. The latest spreadsheet from the teaching team is at: '$LATEST_XLSX' (the top row is next week's bulletin info). Please review relevant material from when we have written previous newsletters and make sure you've got all the context you need."
else
    PROMPT="It's time to write the 1st grade newsletter for Monday, $TARGET_DATE. I couldn't find a spreadsheet matching '~/Downloads/G1 Weekly Newsletter*.xlsx' — please ask me to point you to the right file. Then review relevant material from when we have written previous newsletters and make sure you've got all the context you need."
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  G1 Newsletter — Monday $TARGET_DATE"
echo "  Spreadsheet: ${LATEST_XLSX:-NOT FOUND in ~/Downloads}"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Prefer cc (auto-connects to Remote Control); fall back to plain claude.
if command -v cc > /dev/null 2>&1; then
    exec cc newsletter -- "$PROMPT"
else
    exec claude "$PROMPT"
fi
