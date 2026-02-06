# AeroGuard AI - Startup Script for Windows
# This script starts both backend and frontend servers

Write-Host "`n" -ForegroundColor Cyan
Write-Host "   ___    ____  ____  ____ ____" -ForegroundColor Cyan
Write-Host "  / _ |  / __ \/ __ \/ __ \/ __ \" -ForegroundColor Cyan
Write-Host " / __ | / /_/ / /_/ / /_/ / /_/ /  AeroGuard AI" -ForegroundColor Cyan
Write-Host "/ ___ |/ _, _/ _, _/ _, _/ _, _/    Startup v1.0" -ForegroundColor Cyan
Write-Host "/_/  |_/_/ |_/_/ |_/_/ |_/_/ |_|" -ForegroundColor Cyan
Write-Host "`n" -ForegroundColor Cyan

# Get project root
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "Project Root: $ProjectRoot`n" -ForegroundColor Green

# Step 1: Validate environment
Write-Host "=================================" -ForegroundColor Yellow
Write-Host "Step 1: Validating Environment" -ForegroundColor Yellow
Write-Host "=================================" -ForegroundColor Yellow

Write-Host "Running validation checks..." -ForegroundColor Cyan
& python "$ProjectRoot\validate_setup.py"

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n" -ForegroundColor Red
    Write-Host "✗ Validation failed! Fix the issues above before continuing." -ForegroundColor Red
    Write-Host "`nFor help, see: COMPLETE_SETUP_GUIDE.md" -ForegroundColor Yellow
    Read-Host "`nPress Enter to exit"
    exit 1
}

# Step 2: Install/Update dependencies
Write-Host "`n" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Yellow
Write-Host "Step 2: Installing Dependencies" -ForegroundColor Yellow
Write-Host "=================================" -ForegroundColor Yellow

Write-Host "Installing Python packages..." -ForegroundColor Cyan
Push-Location $ProjectRoot
python -m pip install -q -r requirements.txt
Write-Host "✓ Python packages updated" -ForegroundColor Green

Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
Push-Location "$ProjectRoot\frontend"
npm install --silent 2>$null
Write-Host "✓ Frontend dependencies updated" -ForegroundColor Green
Pop-Location
Pop-Location

# Step 3: Start servers
Write-Host "`n" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Yellow
Write-Host "Step 3: Starting Servers" -ForegroundColor Yellow
Write-Host "=================================" -ForegroundColor Yellow

Write-Host "`nOpening new terminals for backend and frontend..." -ForegroundColor Cyan

# Start backend in new PowerShell window
$BackendScript = @"
cd "$ProjectRoot"
Write-Host "Starting Flask Backend Server..." -ForegroundColor Green
Write-Host "Backend will run on: http://localhost:5000`n" -ForegroundColor Cyan
python backend/app.py
Read-Host "`nPress Enter to exit"
"@

Start-Process PowerShell -ArgumentList "-NoExit", "-Command", $BackendScript

# Start frontend in new PowerShell window
$FrontendScript = @"
cd "$ProjectRoot\frontend"
Write-Host "Starting React Development Server..." -ForegroundColor Green
Write-Host "Frontend will run on: http://localhost:5173`n" -ForegroundColor Cyan
npm run dev
Read-Host "`nPress Enter to exit"
"@

Start-Process PowerShell -ArgumentList "-NoExit", "-Command", $FrontendScript

Write-Host "`n" -ForegroundColor Green
Write-Host "✓ Servers starting..." -ForegroundColor Green
Write-Host "`nOpening browser..." -ForegroundColor Cyan

# Wait a moment for servers to start
Start-Sleep -Seconds 3

# Open browser
Start-Process "http://localhost:5173"

Write-Host "`n" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Green
Write-Host "✓ AeroGuard AI Started!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host "`nBackend:  http://localhost:5000" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host "`nNext Steps:" -ForegroundColor Cyan
Write-Host "1. Open http://localhost:5173 in your browser" -ForegroundColor White
Write-Host "2. Navigate to Dashboard or Live Detection" -ForegroundColor White
Write-Host "3. Click 'Test Threat Alert' button" -ForegroundColor White
Write-Host "4. Check your email within 10-30 seconds" -ForegroundColor White
Write-Host "`nFor help, see: COMPLETE_SETUP_GUIDE.md" -ForegroundColor Yellow
Write-Host "`n" -ForegroundColor Cyan

Read-Host "Press Enter to exit this window"
