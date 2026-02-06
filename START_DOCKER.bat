@echo off
REM Quick start script for AeroGuard AI deployment

setlocal enabledelayedexpansion

echo.
echo ============================================
echo   AeroGuard AI - Docker Deployment
echo ============================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not installed or not in PATH
    echo Please install Docker: https://docs.docker.com/get-docker/
    pause
    exit /b 1
)

echo [OK] Docker is installed
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo WARNING: Docker Compose not found, using docker compose
)

REM Check if .env file exists
if not exist .env (
    echo.
    echo WARNING: .env file not found!
    echo.
    echo Creating template .env file...
    (
        echo # AeroGuard AI Environment Configuration
        echo SENDER_EMAIL=your_email@gmail.com
        echo SENDER_PASSWORD=your_app_password
        echo RECIPIENT_EMAIL=alert@example.com
        echo SMTP_SERVER=smtp.gmail.com
        echo SMTP_PORT=587
        echo FLASK_ENV=production
        echo FLASK_DEBUG=False
    ) > .env
    echo [DONE] Created .env file
    echo.
    echo IMPORTANT: Edit .env with your Gmail credentials:
    echo   - SENDER_EMAIL: Your Gmail address
    echo   - SENDER_PASSWORD: Gmail App Password (see DEPLOYMENT_GUIDE.md)
    echo   - RECIPIENT_EMAIL: Where to send alerts
    echo.
    pause
)

REM Clear previous build artifacts
if exist frontend\dist (
    echo Clearing old frontend build...
    rd /s /q frontend\dist
)

echo.
echo [1/3] Building Docker image...
echo This may take 10-15 minutes on first run...
echo.

docker build -t aeroguard-ai:latest .
if errorlevel 1 (
    echo [ERROR] Docker build failed!
    pause
    exit /b 1
)

echo [OK] Image built successfully
echo.
echo [2/3] Starting containers...
docker-compose up -d
if errorlevel 1 (
    echo [ERROR] Failed to start containers!
    pause
    exit /b 1
)

echo [OK] Containers started
echo.
echo [3/3] Waiting for service to be ready...
timeout /t 5 /nobreak

REM Check if service is running
curl -s http://localhost:5000/api/health >nul 2>&1
if errorlevel 1 (
    echo [WAITING] Service still starting, please wait 30 seconds...
    timeout /t 25 /nobreak
)

echo.
echo ============================================
echo   ✓ AeroGuard AI is ready!
echo ============================================
echo.
echo Access the application at:
echo   http://localhost:5000
echo.
echo View real-time logs:
echo   docker-compose logs -f aeroguard-ai
echo.
echo Stop the application:
echo   docker-compose down
echo.
echo Learn more: Read DEPLOYMENT_GUIDE.md
echo.
pause
