@echo off
setlocal
cd /d "%~dp0"
echo =========================================================
echo          Starting Bharat Sign AI 3 Master Platform
echo =========================================================
echo Launching Backend (FastAPI + AI Translation + Whisper)...
start "Bharat Sign AI Backend" cmd /k "cd /d %~dp0backend && (if exist venv\Scripts\activate.bat (call venv\Scripts\activate.bat) else if exist .venv\Scripts\activate.bat (call .venv\Scripts\activate.bat) else (python -m venv venv && call venv\Scripts\activate.bat && pip install -r requirements.txt)) && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

echo Launching Frontend (Next/React + Three.js + Vite)...
start "Bharat Sign AI Frontend" cmd /k "cd /d %~dp0frontend && if not exist node_modules (call npm install) && npm run dev -- --host 127.0.0.1"

echo Backend and frontend windows launched successfully!
echo Open http://127.0.0.1:5173 once Vite is ready.
endlocal
