#!/usr/bin/env bash
set -e

# Change directory to project root
cd "$(dirname "$0")"

# Execute diary append script
node scripts/append-diary.js "$@"
