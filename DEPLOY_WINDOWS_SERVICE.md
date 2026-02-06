# Windows Service Setup for AeroGuard AI

This guide sets up AeroGuard AI to run automatically when Windows starts.

---

## Option 1: Windows Task Scheduler (Recommended)

### **Step 1: Enable Auto-Start via Task Scheduler**

Run PowerShell as Administrator and execute:

```powershell
# Navigate to project directory
cd "C:\Users\Aadya\OneDrive\Desktop\AeroGuardAI"

# Create scheduled task that runs at system startup
$action = New-ScheduledTaskAction `
    -Execute "python" `
    -Argument "backend/app.py" `
    -WorkingDirectory "C:\Users\Aadya\OneDrive\Desktop\AeroGuardAI"

$trigger = New-ScheduledTaskTrigger -AtStartup

$principal = New-ScheduledTaskPrincipal `
    -UserId "SYSTEM" `
    -LogonType ServiceAccount `
    -RunLevel Highest

Register-ScheduledTask `
    -TaskName "AeroGuard AI" `
    -Action $action `
    -Trigger $trigger `
    -Principal $principal `
    -Description "AeroGuard AI Drone Detection System" `
    -Force
```

### **Step 2: Verify Task Created**

```powershell
Get-ScheduledTask -TaskName "AeroGuard AI" | Select-Object *
```

### **Step 3: Test the Task**

Right-click the task in Task Scheduler and select "Run"

### **Step 4: Verify Application Started**

```powershell
Start-Sleep -Seconds 3
curl http://localhost:5000/api/health
```

---

## Option 2: Startup Folder (Alternative)

1. Press `Win + R`
2. Type: `shell:startup`
3. Create batch file with:
   ```batch
   cd /d "C:\Users\Aadya\OneDrive\Desktop\AeroGuardAI"
   python backend/app.py
   ```

---

## Option 3: NSSM (Non-Sucking Service Manager)

For true Windows Service:

```powershell
# Download NSSM (https://nssm.cc/download)
# Extract to: C:\nssm

# Install service
C:\nssm\nssm install AeroGuardAI python "C:\Users\Aadya\OneDrive\Desktop\AeroGuardAI\backend\app.py"

# Start service
C:\nssm\nssm start AeroGuardAI

# Check status
C:\nssm\nssm status AeroGuardAI
```

---

## Managing the Service

### **Start Service**
```powershell
Start-ScheduledTask -TaskName "AeroGuard AI"
```

### **Stop Service**
```powershell
Stop-ScheduledTask -TaskName "AeroGuard AI"
```

### **View Running Task**
```powershell
Get-ScheduledTask -TaskName "AeroGuard AI" | Get-ScheduledTaskInfo
```

### **Remove Service**
```powershell
Unregister-ScheduledTask -TaskName "AeroGuard AI" -Confirm:$false
```

---

## Logs & Monitoring

Since the service runs as SYSTEM, logs are written to project directory:

```powershell
# View recent activity
Get-WinEvent -FilterHashtable @{LogName='System'; ProviderName='Task Scheduler'} | 
    Where-Object {$_.Message -like '*AeroGuard*'} | 
    Select-Object TimeCreated, Message | 
    Format-Table -AutoSize
```

---

## Production Recommendations

✅ Use Task Scheduler for auto-start  
✅ Set restart on failure  
✅ Monitor health endpoint: `http://localhost:5000/api/health`  
✅ Log application output  
✅ Set up email alerts for failures  

---

## Health Monitoring Script

Create `monitor.ps1`:

```powershell
# Monitor script - run every 5 minutes via Task Scheduler

$url = "http://localhost:5000/api/health"
$maxRetries = 3
$retryCount = 0

while ($retryCount -lt $maxRetries) {
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "[$(Get-Date)] ✓ AeroGuard AI is healthy" -ForegroundColor Green
            exit 0
        }
    }
    catch {
        $retryCount++
        if ($retryCount -lt $maxRetries) {
            Start-Sleep -Seconds 10
        }
    }
}

# If we get here, service is down - could send alert
Write-Host "[$(Get-Date)] ✗ AeroGuard AI is NOT responding" -ForegroundColor Red
Write-Host "Attempting restart..."

Stop-ScheduledTask -TaskName "AeroGuard AI" -ErrorAction SilentlyContinue
Start-Sleep -Seconds 5
Start-ScheduledTask -TaskName "AeroGuard AI"

exit 1
```

Then schedule this to run every 5 minutes!

---

## Troubleshooting

### **Task Shows Error 0x41301**
- Usually means working directory doesn't exist
- Fix: Verify path: `C:\Users\Aadya\OneDrive\Desktop\AeroGuardAI`

### **Port 5000 Still in Use**
```powershell
Get-NetTCPConnection -LocalPort 5000 | Stop-Process -Force
```

### **Permission Denied**
- Run PowerShell as Administrator
- Use `SYSTEM` principal in scheduled task

---

## Verify Deployment

1. **System Restart:** Restart computer
2. **Check Running:** `curl http://localhost:5000`
3. **Access Dashboard:** http://localhost:5000
4. **Test Email:** Click "Test Threat Alert" button

---

**Now your application auto-starts with Windows!** 🚀
