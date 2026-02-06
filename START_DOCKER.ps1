#!/usr/bin/env pwsh
# PowerShell deployment script for AeroGuard AI

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  AeroGuard AI - Docker Deployment" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check Docker installation
try {
    $dockerVersion = docker --version
    Write-Host "[✓] Docker installed: $dockerVersion" -ForegroundColor Green
}
catch {
    Write-Host "[✗] Docker not found. Install from: https://docs.docker.com/get-docker/" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check Docker Compose
try {
    $composeVersion = docker-compose --version
    Write-Host "[✓] Docker Compose installed: $composeVersion" -ForegroundColor Green
}
catch {
    Write-Host "[⚠] Docker Compose not found, will use: docker compose" -ForegroundColor Yellow
}

Write-Host ""

# Check .env file
if (-not (Test-Path ".env")) {
    Write-Host "[!] .env file not found, creating template..." -ForegroundColor Yellow
    
    @"
# AeroGuard AI Environment Configuration
SENDER_EMAIL=your_email@gmail.com
SENDER_PASSWORD=your_app_password
RECIPIENT_EMAIL=alert@example.com
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
FLASK_ENV=production
FLASK_DEBUG=False
"@ | Out-File -Encoding UTF8 .env
    
    Write-Host "[✓] Created .env file" -ForegroundColor Green
    Write-Host ""
    Write-Host "IMPORTANT: Edit .env with your Gmail credentials:" -ForegroundColor Yellow
    Write-Host "  - SENDER_EMAIL: Your Gmail address" -ForegroundColor Yellow
    Write-Host "  - SENDER_PASSWORD: Gmail App Password (see DEPLOYMENT_GUIDE.md)" -ForegroundColor Yellow
    Write-Host "  - RECIPIENT_EMAIL: Where to send alerts" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter once you've updated .env"
}

Write-Host ""
Write-Host "[1/3] Building Docker image..." -ForegroundColor Cyan
Write-Host "This may take 10-15 minutes on first run..." -ForegroundColor Gray
Write-Host ""

docker build -t aeroguard-ai:latest .
if ($LASTEXITCODE -ne 0) {
    Write-Host "[✗] Docker build failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[✓] Image built successfully" -ForegroundColor Green
Write-Host ""
Write-Host "[2/3] Starting containers..." -ForegroundColor Cyan

docker-compose up -d
if ($LASTEXITCODE -ne 0) {
    Write-Host "[✗] Failed to start containers!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[✓] Containers started" -ForegroundColor Green
Write-Host ""
Write-Host "[3/3] Waiting for service to be ready..." -ForegroundColor Cyan

Start-Sleep -Seconds 5

# Test health endpoint
$maxRetries = 6
$retryCount = 0
$healthy = $false

while ($retryCount -lt $maxRetries) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $healthy = $true
            break
        }
    }
    catch {
        # Service not ready yet
    }
    
    if ($retryCount -lt $maxRetries - 1) {
        Write-Host "  ⏳ Checking service... ($($retryCount + 1)/$maxRetries)" -ForegroundColor Gray
        Start-Sleep -Seconds 5
    }
    
    $retryCount++
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
if ($healthy) {
    Write-Host "  ✓ AeroGuard AI is ready!" -ForegroundColor Green
}
else {
    Write-Host "  ⚠ Service starting... (check logs below)" -ForegroundColor Yellow
}
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Access the application at:" -ForegroundColor White
Write-Host "  http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "View real-time logs:" -ForegroundColor White
Write-Host "  docker-compose logs -f aeroguard-ai" -ForegroundColor Cyan
Write-Host ""
Write-Host "Stop the application:" -ForegroundColor White
Write-Host "  docker-compose down" -ForegroundColor Cyan
Write-Host ""
Write-Host "Learn more: Read DEPLOYMENT_GUIDE.md" -ForegroundColor Gray
Write-Host ""

Read-Host "Press Enter to exit"
