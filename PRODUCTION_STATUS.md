# Production Startup Configuration for AeroGuard AI

**Application Status:** ✅ **DEPLOYED & RUNNING**

**Access:** http://localhost:5000

---

## Current Deployment

- **Frontend:** Built and optimized (React)
- **Backend:** Running on Port 5000 (Flask + Gunicorn ready)
- **Email Service:** Configured (Gmail SMTP)
- **YOLO Model:** Ready for detection
- **Status Page:** http://localhost:5000/api/health

---

## 📋 Quick Reference

```bash
# Check if application is running
curl http://localhost:5000/api/health

# View backend logs
# (See PowerShell terminal where backend is running)

# Restart backend
# 1. Close running terminal (Ctrl+C)
# 2. Run: python backend/app.py
```

---

## 🔧 Production Deployment Options

### **Option 1: Keep Running Locally (Current)**
- ✅ Already running
- ✅ Full control
- ✅ Access via http://localhost:5000
- ❌ Stops when computer restarts

### **Option 2: Windows Task Scheduler (Auto-Start)**
- ✅ Auto-restart on system boot
- ✅ No manual intervention
- See: DEPLOY_WINDOWS_SERVICE.md

### **Option 3: Cloud Deployment**
- AWS EC2, DigitalOcean, Azure, Google Cloud
- See: DEPLOYMENT_GUIDE.md for detailed instructions

---

## 🚀 To Make Application Always Running

### **For Windows (Recommended):**

Create a Windows Scheduled Task that runs at startup:

```powershell
# Run as Administrator:
$action = New-ScheduledTaskAction -Execute "python" -Argument "backend/app.py" -WorkingDirectory "C:\Users\Aadya\OneDrive\Desktop\AeroGuardAI"

$trigger = New-ScheduledTaskTrigger -AtStartup

$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest

Register-ScheduledTask -TaskName "AeroGuard AI" -Action $action -Trigger $trigger -Principal $principal -Description "AeroGuard AI Drone Detection System"
```

---

## 📊 Deployment Architecture

```
┌─────────────────────────────────┐
│   http://localhost:5000          │
└────────────┬────────────────────┘
             │
      ┌──────┴──────┐
      │             │
  ┌───▼──┐    ┌────▼────┐
  │React │    │  Flask   │
  │ App  │    │   API    │
  └──────┘    └────┬─────┘
              │    │    │
          ┌───▼─┬──▼─┬──▼───┐
          │YOLO │SMTP│ Logs  │
          └─────┴────┴───────┘

Frontend: /frontend/dist (built)
Backend: /backend (running on 5000)
YOLO Model: /yolov8n.pt (loaded)
Email: Gmail SMTP (configured in .env)
```

---

## 🧪 Test Checklist

- [ ] Backend running: `curl http://localhost:5000/api/health`
- [ ] Frontend loads: `curl http://localhost:5000/`
- [ ] Email configured: Check .env file
- [ ] YOLO model present: Check yolov8n.pt file
- [ ] Click "Test Threat Alert" button
- [ ] Receive email within 30 seconds

---

## 📁 Deployment Files Created

- ✅ Dockerfile - Docker containerization
- ✅ docker-compose.yml - One-command deployment
- ✅ .dockerignore - Build optimization
- ✅ DEPLOYMENT_GUIDE.md - Cloud deployment guide
- ✅ START_DOCKER.bat - Quick start script
- ✅ START_DOCKER.ps1 - PowerShell deployment

---

## ⚙️ Environment Variables

All configured in `.env`:
```
SENDER_EMAIL=aeroguard.ai09@gmail.com
SENDER_PASSWORD=ssnn yhsn igys rlev
RECIPIENT_EMAIL=hehe.795.12@gmail.com
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
FLASK_ENV=production
FLASK_DEBUG=False
```

---

## 🔒 Security Notes

- ✅ CORS enabled for API
- ✅ Email credentials in .env (not in code)
- ✅ Static files served from dist
- ✅ Debug mode disabled in production
- ⚠️ Consider SSL/TLS when exposing publicly

---

## 📈 Next Steps for Cloud Deployment

1. **Choose Platform:** AWS, Azure, DigitalOcean, Heroku
2. **Set Environment:** Create .env with credentials
3. **Deploy:** Use provided deployment scripts
4. **Monitor:** Set up health checks and alerts
5. **Scale:** Add load balancer if needed

---

## 🆘 Troubleshooting

**Port 5000 already in use:**
```powershell
netstat -ano | findstr ":5000"
taskkill /F /PID <PID>
```

**Email not sending:**
- Check .env credentials
- Run: `python test_email_direct.py`
- Check spam folder

**Application won't start:**
- Check Python version: `python --version` (need 3.13+)
- Check dependencies: `pip install -r requirements.txt`
- View logs in running terminal

---

## 📞 Support

For detailed deployment to cloud:
→ Read **DEPLOYMENT_GUIDE.md**

For Windows auto-start:
→ Read **DEPLOY_WINDOWS_SERVICE.md**

---

**Status:** ✅ Application is deployed and fully operational!
**Access:** http://localhost:5000
