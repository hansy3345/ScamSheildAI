@echo off
title ScamShield AI ? Launching...
color 0B

echo.
echo  ============================================
echo   ScamShield AI ^| Launching All Services
echo  ============================================
echo.

echo  [1/3] Starting Backend  (http://localhost:8000)...
start "ScamShield Backend" cmd /k "cd /d %~dp0backend && python app/main.py"

echo  [2/3] Starting Frontend (http://localhost:3000)...
start "ScamShield Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo  [3/3] Opening browser in 5 seconds...
timeout /t 5 /nobreak >nul
start "" "http://localhost:3000"

echo.
echo  All done! ScamShield AI is running.
echo  Close the two server windows to stop.
echo.
timeout /t 3 /nobreak >nul
exit
