#!/usr/bin/env bash
# Build the thin WKWebView host and install/launch it on booted iPhone simulators.
# Usage: ./build-and-run.sh            (installs on all booted devices)
#        ./build-and-run.sh <udid>...  (installs on the given device udids)
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
BUILD="$HERE/build"
APP="$BUILD/PetCare.app"
BUNDLE_ID="com.petcare247.prototype"
ARCH="$(uname -m)"                 # arm64 (Apple Silicon) or x86_64 (Intel)
TARGET="${ARCH}-apple-ios16.0-simulator"

echo "→ Building PetCare.app for $TARGET"
rm -rf "$APP"; mkdir -p "$APP"
cp "$HERE/Info.plist" "$APP/Info.plist"

xcrun -sdk iphonesimulator swiftc \
  -target "$TARGET" \
  -framework UIKit -framework WebKit \
  -o "$APP/PetCare" \
  "$HERE/main.swift"

echo "→ Built $APP"

# pick target devices
DEVICES=("$@")
if [ ${#DEVICES[@]} -eq 0 ]; then
  while IFS= read -r line; do
    udid="$(echo "$line" | grep -oE '[0-9A-F-]{36}')"
    [ -n "$udid" ] && DEVICES+=("$udid")
  done < <(xcrun simctl list devices booted | grep -iE 'iphone')
fi

if [ ${#DEVICES[@]} -eq 0 ]; then
  echo "No booted iPhone simulators found. Boot one and re-run." >&2
  exit 1
fi

open -a Simulator || true
for udid in "${DEVICES[@]}"; do
  echo "→ Installing on $udid"
  xcrun simctl install "$udid" "$APP"
  xcrun simctl launch "$udid" "$BUNDLE_ID" || true
  echo "  ✓ launched on $udid"
done
echo "Done."
