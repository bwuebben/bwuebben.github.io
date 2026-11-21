#!/bin/bash
# Regenerate the link-preview cards in assets/ from their sources in tools/.
set -e
cd "$(dirname "$0")/.."
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

render() {  # render <source.html> <target.jpg>
  local png
  png="$(mktemp -t social-card).png"
  "$CHROME" --headless --disable-gpu --hide-scrollbars \
    --window-size=1200,630 --screenshot="$png" "file://$PWD/$1" 2>/dev/null
  sips -s format jpeg -s formatOptions 86 "$png" --out "$2" >/dev/null
  rm -f "$png"
  echo "$2 $(sips -g pixelWidth -g pixelHeight "$2" | tail -2 | tr -d ' \n')"
}

render tools/social-card.html       assets/social-card.jpg
render tools/social-card-essay.html assets/social-card-essay.jpg
