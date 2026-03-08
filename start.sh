#!/bin/bash
# ListMate — Demo Day Startup Script
# Run this from the project root: ./start.sh

set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "  ListMate — Starting servers"
echo "  =================================="

# ---- Backend ----
echo ""
echo "  [1/2] Starting backend (FastAPI on :8000)..."
cd "$ROOT/backend"

if [ ! -f ".env" ]; then
  echo "  ERROR: backend/.env not found. Copy .env.example and add your API keys."
  exit 1
fi

if grep -q "sk-ant-your-key-here" .env; then
  echo "  WARNING: ANTHROPIC_API_KEY is still a placeholder in backend/.env"
  echo "           The app will run in DEMO_MODE (fallback responses)."
fi

source venv/bin/activate
uvicorn main:app --reload --port 8000 --log-level warning &
BACKEND_PID=$!
echo "  Backend PID: $BACKEND_PID"

# ---- Frontend ----
echo ""
echo "  [2/2] Starting frontend (Vite on :5173)..."
cd "$ROOT/frontend"
npm run dev &
FRONTEND_PID=$!
echo "  Frontend PID: $FRONTEND_PID"

echo ""
echo "  =================================="
echo "  App running at: http://localhost:5173"
echo "  API docs at:    http://localhost:8000/docs"
echo ""
echo "  Press Ctrl+C to stop both servers."
echo ""

# Wait for Ctrl+C and then clean up both PIDs
trap "echo ''; echo '  Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" SIGINT SIGTERM
wait
