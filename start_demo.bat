@echo off
echo ===================================================
echo   Post Op Pal - Local Demo Launcher
echo ===================================================

echo [1/4] Starting AI Microservice (Port 8000)...
start "PostOpPal AI Service" cmd /k "cd scripts & python -m uvicorn app_fastapi:app --host 0.0.0.0 --port 8000 --reload"

echo [2/4] Starting Backend Server (Port 5000)...
echo       Please ensure you have run 'npm install' in /server if first run.
start "PostOpPal Backend" cmd /k "cd server & npm start"

echo [3/4] Starting Frontend Dashboard (Port 5173)...
echo       Please ensure you have run 'npm install' in /frontend if first run.
start "PostOpPal Frontend" cmd /k "cd frontend & npm run dev"

echo [4/4] Starting WhatsApp Bot Simulation (Port 5001)...
start "PostOpPal WhatsApp Bot" cmd /k "python whatsapp-bot/server.py"

echo ===================================================
echo   All services launched!
echo   - AI Service: http://localhost:8000/docs
echo   - Backend:    http://localhost:5000
echo   - Frontend:   http://localhost:5173
echo   - WhatsApp:   http://localhost:5001
echo ===================================================
pause
