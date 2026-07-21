#!/usr/bin/env bash

set -euo pipefail

# Update cache-busting query strings for local CSS and JavaScript assets.
# The version is derived from the file contents, so it changes only when the
# asset changes. Run this script from anywhere; paths are relative to this file.

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$project_dir"

if command -v shasum >/dev/null 2>&1; then
  hash_file() {
    shasum -a 256 "$1" | awk '{print substr($1, 1, 12)}'
  }
elif command -v sha256sum >/dev/null 2>&1; then
  hash_file() {
    sha256sum "$1" | awk '{print substr($1, 1, 12)}'
  }
else
  echo "Error: shasum or sha256sum is required." >&2
  exit 1
fi

updated_references=0

while IFS= read -r -d '' asset; do
  asset="${asset#./}"
  version="$(hash_file "$asset")"

  while IFS= read -r -d '' html_file; do
    temporary_file="$(mktemp "${TMPDIR:-/tmp}/version-assets.XXXXXX")"

    ASSET_PATH="$asset" ASSET_VERSION="$version" perl -0pe '
      BEGIN {
        $asset = quotemeta($ENV{"ASSET_PATH"});
        $version = $ENV{"ASSET_VERSION"};
      }
      s{((?:\./|/)?$asset)(?:\?v=[^"\x27#\s]*)?}{$1 . "?v=" . $version}ge;
    ' "$html_file" > "$temporary_file"

    if ! cmp -s "$html_file" "$temporary_file"; then
      cp "$temporary_file" "$html_file"
      echo "Updated $html_file: $asset?v=$version"
      updated_references=$((updated_references + 1))
    fi

    rm -f "$temporary_file"
  done < <(
    find . \
      -type d \( -name .git -o -name node_modules \) -prune -o \
      -type f -name '*.html' -print0
  )
done < <(
  find . \
    -type d \( -name .git -o -name node_modules \) -prune -o \
    -type f \( -name '*.css' -o -name '*.js' \) -print0
)

if (( updated_references == 0 )); then
  echo "Asset versions are already up to date."
else
  echo "Updated $updated_references asset reference(s)."
fi
