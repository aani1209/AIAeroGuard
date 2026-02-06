#!/usr/bin/env powershell
# AeroGuard AI - Production Deployment Manager

param(
    [ValidateSet('start', 'stop', 'restart', 'status', 'logs', 'health')][string]$Action = 'status'
)

$projectRoot = "C:\Users\Aadya\OneDrive\Desktop\AeroGuardAI"
$backendPort = 5000
$logFile = "$projectRoot\aeroguard.log"

function Write-Status {
    param([string]$Message, [ValidateSet('Success', 'Error', 'Info', 'Warning')][string]$Type = 'Info')
    
    $colors = @{
        'Success' = 'Green'
        'Error'   = 'Red'
        'Info'    = 'Cyan'
        'Warning' = 'Yellow'
    }
    
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $Message" -ForegroundColor $colors[$Type]
}

function Start-AeroGuardAI {
    Write-Status "Starting AeroGuard AI..." Info
    
    if (Test-Connection 127.0.0.1 -TcpPort $backendPort -ErrorAction SilentlyContinue) {
        Write-Status "Service already running on port $backendPort" Warning
        return
    }
    
    Write-Status "Building frontend..." Info
    Set-Location "$projectRoot\frontend"
    npm run build 2>&1 | Out-File -Append $logFile
    
    Write-Status "Starting backend..." Info
    Set-Location $projectRoot
    
    Start-Process -FilePath python `
        -ArgumentList "backend/app.py" `
        -WorkingDirectory $projectRoot `
        -RedirectStandardOutput "$logFile" `
        -RedirectStandardError "$logFile" `
        -WindowStyle Hidden
    
    Write-Status "Waiting for service startup..." Info
    for ($i = 0; $i -lt 30; $i++) {
        if (Test-Connection 127.0.0.1 -TcpPort $backendPort -ErrorAction SilentlyContinue) {
            Write-Status "✓ Service started successfully!" Success
            Write-Status "Access at: http://localhost:5000" Success
            return
        }
        Start-Sleep -Seconds 1
        Write-Host "." -NoNewline
    }
    
    Write-Status "Failed to start service - check logs" Error
}

function Stop-AeroGuardAI {
    Write-Status "Stopping AeroGuard AI..." Info
    
    $process = Get-Process -Name python -ErrorAction SilentlyContinue | 
        Where-Object { $_.CommandLine -like "*backend/app.py*" }
    
    if ($process) {
        Stop-Process -InputObject $process -Force
        Write-Status "✓ Service stopped" Success
    }
    else {
        Write-Status "Service not running" Warning
    }
}

function Restart-AeroGuardAI {
    Stop-AeroGuardAI
    Start-Sleep -Seconds 2
    Start-AeroGuardAI
}

function Get-AeroGuardStatus {
    Write-Host ""
    Write-Status "=== AeroGuard AI Status ===" Info
    Write-Host ""
    
    # Check port
    if (Test-Connection 127.0.0.1 -TcpPort $backendPort -ErrorAction SilentlyContinue) {
        Write-Status "Backend: ✓ RUNNING (Port $backendPort)" Success
        
        # Check health endpoint
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:$backendPort/api/health" `
                -UseBasicParsing -TimeoutSec 5 -ErrorAction SilentlyContinue
            
            if ($response.StatusCode -eq 200) {
                Write-Status "Health Check: ✓ HEALTHY" Success
                Write-Host ""
                Write-Host "Frontend: http://localhost:$backendPort" -ForegroundColor Green
                Write-Host "API Health: http://localhost:$backendPort/api/health" -ForegroundColor Green
            }
        }
        catch {
            Write-Status "Health Check: ⚠ Failed" Warning
        }
    }
    else {
        Write-Status "Backend: ✗ NOT RUNNING" Error
        Write-Status "Use: $($MyInvocation.ScriptName) start" Info
    }
    
    Write-Host ""
}

function Show-Logs {
    Write-Status "=== Recent Logs ===" Info
    Write-Host ""
    
    if (Test-Path $logFile) {
        Get-Content $logFile -Tail 50
    }
    else {
        Write-Status "No logs found" Warning
    }
    
    Write-Host ""
}

# Ensure we're in the right directory
Set-Location $projectRoot

# Execute requested action
switch ($Action) {
    'start'   { Start-AeroGuardAI }
    'stop'    { Stop-AeroGuardAI }
    'restart' { Restart-AeroGuardAI }
    'status'  { Get-AeroGuardStatus }
    'logs'    { Show-Logs }
    'health'  {
        Write-Status "Checking health endpoint..." Info
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:$backendPort/api/health" `
                -UseBasicParsing | ConvertFrom-Json
            Write-Host ($response | Format-Table -AutoSize | Out-String) -ForegroundColor Green
        }
        catch {
            Write-Status "Health check failed: $($_.Exception.Message)" Error
        }
    }
}

Write-Host ""
