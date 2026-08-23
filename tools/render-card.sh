#!/bin/bash
# Regenerate assets/social-card.jpg from tools/social-card.html.
set -e
cd "$(dirname "$0")/.."
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless --disable-gpu --hide-scrollbars \
  --window-size=1200,630 --screenshot=/tmp/social-card.png \
  "file://$PWD/tools/social-card.html" 2>/dev/null
sips -s format jpeg -s formatOptions 86 /tmp/social-card.png \
  --out assets/social-card.jpg >/dev/null
rm -f /tmp/social-card.png
echo "assets/social-card.jpg $(sips -g pixelWidth -g pixelHeight assets/social-card.jpg | tail -2 | tr -d ' \n')"
