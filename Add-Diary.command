#!/usr/bin/env bash
cd "$(dirname "$0")"
node scripts/append-diary.js "$@"
echo ""
read -p "Press [Enter] to exit..."
