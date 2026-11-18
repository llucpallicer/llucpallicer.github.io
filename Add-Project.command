#!/usr/bin/env bash
cd "$(dirname "$0")"
node scripts/append-project.js "$@"
echo ""
read -p "Press [Enter] to exit..."
