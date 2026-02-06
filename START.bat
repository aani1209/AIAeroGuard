@echo off
REM AeroGuard AI - Simple Startup Script for Windows

cls
echo.
echo    ___    ____  ____  ____ ____
echo   / _ ^|  / __ \/ __ \/ __ \/ __ \
echo  / __ ^| / /_/ / /_/ / /_/ / /_/ /  AeroGuard AI
echo / ___ ^|/ _, _/ _, _/ _, _/ _, _/   Startup v1.0
echo /_/  ^|_/_/ ^|_/_/ ^|_/_/ ^|_/_/ ^|_^|
echo.
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo WARNING: Node.js is not installed or not in PATH
    echo Frontend development will not work
    echo Install from https://nodejs.org/
    echo.
)

echo ========================================
echo Installing/Updating Dependencies
echo ========================================
echo.

echo Installing Python packages...
python -m pip install -q -r requirements.txt
echo Done.

echo.
echo Installing frontend dependencies...
cd frontend
call npm install --silent
cd ..
echo Done.

echo.
echo ========================================
echo Starting Servers
echo ========================================
echo.

REM Start backend and frontend in separate windows
start "AeroGuard AI - Backend" cmd /k "python backend/app.py"
start "AeroGuard AI - Frontend" cmd /k "cd frontend && npm run dev && pause"

REM Open browser
timeout /t 3 /nobreak
start http://localhost:5173

echo.
echo ========================================
echo AeroGuard AI Started!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Servers are starting in separate windows...
echo.
pause
