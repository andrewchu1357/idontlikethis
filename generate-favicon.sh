#!/usr/bin/env bash
# Generate a proper favicon.ico from favicon.svg using ImageMagick
# Requires: imagemagick (convert) or rsvg-convert + convert
# Usage: ./generate-favicon.sh
set -e
if ! command -v convert >/dev/null 2>&1; then
  echo "ImageMagick 'convert' not found. Install it with 'brew install imagemagick' or use rsvg-convert + convert."
  exit 1
fi

# Generate PNG sizes and combine into an .ico
convert favicon.svg -background none -resize 16x16 favicon-16.png
convert favicon.svg -background none -resize 32x32 favicon-32.png
convert favicon.svg -background none -resize 48x48 favicon-48.png
convert favicon-16.png favicon-32.png favicon-48.png favicon.ico
rm -f favicon-16.png favicon-32.png favicon-48.png

echo "favicon.ico created."
