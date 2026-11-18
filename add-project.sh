#!/usr/bin/env bash
set -e

# Change directory to project root
cd "$(dirname "$0")"

# Execute project append script
node scripts/append-project.js "$@"
