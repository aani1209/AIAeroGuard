# ⚡ AeroGuard AI - Quick Reference

## 🚀 Start Everything (One Click!)

### Windows
Double-click one of these:
```
START.bat         ← Simple batch file
START.ps1         ← PowerShell (more features)
```

Auto-starts:
- ✓ Backend on http://localhost:5000
- ✓ Frontend on http://localhost:5173
- ✓ Opens browser automatically

---

## 🔧 Manual Startup (If starting scripts won't work)

### Terminal 1: Backend
```powershell
cd C:\Users\Aadya\OneDrive\Desktop\AeroGuardAI
python backend/app.py
```

### Terminal 2: Frontend
```powershell
cd C:\Users\Aadya\OneDrive\Desktop\AeroGuardAI\frontend
npm run dev
```

### Browser
```
http://localhost:5173
```

---

## ✅ Verify Everything Works

Run validation script:
```powershell
python validate_setup.py
```

Should see:
- ✓ Python Version
- ✓ Python Packages
- ✓ Environment File
- ✓ Backend Structure
- ✓ Frontend Structure
- ✓ Node.js Installation
- ✓ Frontend Dependencies
- ✓ Email Credentials

---

## 📧 Send a Test Email

1. Open http://localhost:5173 in browser
2. Go to **Dashboard** or **Live Detection**
3. Click red **"Test Threat Alert"** button
4. Wait for message: "✓ Threat alert sent!"
5. Check email within 10-30 seconds

Email received at: **hehe.795.12@gmail.com**

---

## 📍 Key URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| Backend Health | http://localhost:5000/api/health |

---

## 🔌 Test API Endpoints

### Health Check (Browser Console)
Paste and run:
```javascript
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(d => console.log(d))
```

### Send Alert (Browser Console)
```javascript
fetch('http://localhost:5000/api/trigger', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    threat_detected: true,
    detection: {
      class_name: 'drone',
      confidence: 0.95,
      bbox: [100, 100, 200, 200],
      timestamp: new Date().toISOString(),
      threat_level: 'HIGH'
    }
  })
})
.then(r => r.json())
.then(d => console.log(d))
```

---

## 📁 Important Files

| File | Purpose | Edit? |
|------|---------|-------|
| `.env` | Email credentials | ✏️ If needed |
| `requirements.txt` | Python packages | ❌ Don't touch |
| `backend/app.py` | Flask server | ❌ Don't touch |
| `frontend/src/lib/api.ts` | API service | ❌ Don't touch |
| `frontend/src/app/components/LiveCameraFeed.tsx` | Alert UI | ❌ Don't touch |
| `frontend/src/app/pages/LiveDetection.tsx` | Alert UI | ❌ Don't touch |

---

## 🐛 Quick Fixes

### Email not received?
1. Check spam folder
2. Look at backend console for errors
3. Test directly: `python backend/email_alert.py`

### Can't connect to backend?
1. Is backend running? Look for "Running on http://0.0.0.0:5000"
2. Check port 5000 is free: `netstat -ano | findstr :5000`
3. If in use, kill it: `taskkill /PID <PID> /F`

### Frontend shows blank page?
1. Check browser console (F12 > Console)
2. Hard refresh: Ctrl+Shift+R
3. Rebuild: `cd frontend && npm run build`

### Package not found?
```powershell
pip install -r requirements.txt
cd frontend && npm install
```

---

## 📊 System Status

To check system health:

```javascript
// In browser console:
fetch('http://localhost:5000/api/status')
  .then(r => r.json())
  .then(d => console.log(JSON.stringify(d, null, 2)))
```

Response includes:
- Jammer status
- Email service status
- Number of threats logged

---

## 🚨 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| `ModuleNotFoundError: flask_cors` | `pip install flask-cors` |
| `CORS Error` in console | Already fixed! (in app.py) |
| `Cannot find module '@/lib/api'` | Already fixed! (in tsconfig.json) |
| Port 5000 already in use | Kill process or use port 5001 |
| Email not received | Check spam folder, wait 30 sec |
| Blank frontend page | Hard refresh (Ctrl+Shift+R) |

---

## 📧 Email Configuration

Located in `.env`:

```
SENDER_EMAIL=aeroguard.ai09@gmail.com
SENDER_PASSWORD=ssnn yhsn igys rlev
RECIPIENT_EMAIL=hehe.795.12@gmail.com
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
```

**Don't share this file!** It has email credentials.

---

## 📚 Documentation

For more help:
- `COMPLETE_SETUP_GUIDE.md` ← Detailed setup guide
- `SYSTEM_INTEGRATION_COMPLETE.md` ← Full system overview
- `FRONTEND_EMAIL_INTEGRATION.md` ← Email integration details

---

## 🎯 What Works Now

✅ **Frontend → Backend Communication**
- API calls working
- Path aliases working (@/lib)
- TypeScript compilation working

✅ **Email Alerts**
- SMTP authentication working
- Email sending working
- UI buttons triggering alerts

✅ **API Endpoints**
- POST /api/trigger ← Sends alerts
- GET /api/health ← Check status
- GET /api/status ← System info
- All other endpoints working

✅ **Configuration**
- .env loaded correctly
- CORS enabled
- Dependencies installed

---

## 🎓 Workflow

```
1. Open browser → http://localhost:5173
2. Navigate to Dashboard or Live Detection
3. Click "Test Threat Alert" button
4. See: "Sending threat alert..."
5. See: "✓ Threat alert sent!"
6. Check email in 10-30 seconds
7. 🎉 Email received in inbox!
```

---

## 📞 Still Having Issues?

1. **Run validation:** `python validate_setup.py`
2. **Check logs:** Look at backend console
3. **Browser console:** F12 > Console tab
4. **Read guide:** `COMPLETE_SETUP_GUIDE.md`
5. **Manual test:** `python backend/email_alert.py`

---

**Everything is ready!** 🚀
Just run `START.bat` or `START.ps1`

Happy detecting! 🎯
