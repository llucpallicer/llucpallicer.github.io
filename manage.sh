#!/usr/bin/env bash
cd "$(dirname "$0")"

while true; do
  clear
  echo "======================================================"
  echo "         LLUC PALLICER - CONTENT MANAGER              "
  echo "======================================================"
  echo "  1) Add Project (from new-project.json)"
  echo "  2) Add Project (step-by-step interactive wizard)"
  echo "  3) Add Diary Entry (from new-diary.json)"
  echo "  4) Add Diary Entry (step-by-step interactive wizard)"
  echo "  5) List current Projects & Diary Entries"
  echo "  6) Rebuild website (npm run build)"
  echo "  7) Start local preview server (npm run dev)"
  echo "  8) Exit"
  echo "======================================================"
  echo -n "Choose an option [1-8]: "
  read choice

  case "$choice" in
    1)
      node scripts/append-project.js
      echo ""
      read -p "Press [Enter] to return to menu..."
      ;;
    2)
      node scripts/append-project.js --wizard
      echo ""
      read -p "Press [Enter] to return to menu..."
      ;;
    3)
      node scripts/append-diary.js
      echo ""
      read -p "Press [Enter] to return to menu..."
      ;;
    4)
      node scripts/append-diary.js --wizard
      echo ""
      read -p "Press [Enter] to return to menu..."
      ;;
    5)
      node scripts/list-content.js
      echo ""
      read -p "Press [Enter] to return to menu..."
      ;;
    6)
      echo "Building website..."
      npm run build
      echo ""
      read -p "Press [Enter] to return to menu..."
      ;;
    7)
      echo "Starting local dev server at http://localhost:5173..."
      echo "Press Ctrl+C to stop the server."
      npm run dev
      ;;
    8)
      echo "Goodbye!"
      exit 0
      ;;
    *)
      echo "Invalid option. Please choose 1-8."
      sleep 1
      ;;
  esac
done
