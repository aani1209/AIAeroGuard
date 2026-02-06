# 🚀 AeroGuard AI - Complete Setup & Startup Guide

## ⚡ Quick Start (5 Minutes)

### Step 1: Install Python Dependencies
```powershell
cd C:\Users\Aadya\OneDrive\Desktop\AeroGuardAI
pip install -r requirements.txt
```

**Note:** If you get an error, upgrade pip first:
```powershell
python -m pip install --upgrade pip
```

---

### Step 2: Install Frontend Dependencies
```powershell
cd frontend
npm install
```

If `npm` is not found, [install Node.js](https://nodejs.org/) first.

---

### Step 3: Start Backend Server (Terminal 1)
```powershell
cd C:\Users\Aadya\OneDrive\Desktop\AeroGuardAI
python backend/app.py
```

You should see:
```
========================================================================
AeroGuard AI Backend + Frontend Server Starting
========================================================================
Host: 0.0.0.0
Port: 5000
Debug: True
========================================================================
Running on http://0.0.0.0:5000
```

---

### Step 4: Start Frontend Development Server (Terminal 2)
```powershell
cd C:\Users\Aadya\OneDrive\Desktop\AeroGuardAI\frontend
npm run dev
```

You should see:
```
  VITE v6.4.1  ready in 256 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

---

### Step 5: Test Email Alerts
1. Open browser: `http://localhost:5173`
2. Navigate to **Dashboard** or **Live Detection** page
3. Click **"Test Threat Alert"** button
4. ✅ Check your email within 10-30 seconds!

---

## ✅ Checklist Before You Start

### Python Environment
- [ ] Python 3.8+ installed: `python --version`
- [ ] Flask installed: `pip show flask`
- [ ] flask-cors installed: `pip show flask-cors` (required!)
- [ ] All packages in requirements.txt installed: `pip list`

### Frontend Environment
- [ ] Node.js installed: `node --version`
- [ ] npm installed: `npm --version`
- [ ] node_modules exists: Check `frontend/node_modules/` folder
- [ ] package dependencies installed: `npm list` (should list all packages)

### Email Configuration
- [ ] `.env` file exists in project root
- [ ] `SENDER_EMAIL` configured (Gmail address)
- [ ] `SENDER_PASSWORD` configured (Gmail App Password - NOT regular password)
- [ ] `RECIPIENT_EMAIL` configured (where alerts will be sent)

### Project Structure
```
AeroGuardAI/
├── .env                          ✓ Email credentials
├── requirements.txt              ✓ Python packages
├── backend/
│   ├── app.py                    ✓ Flask server
│   ├── email_alert.py            ✓ Email service
│   └── jammer_sim.py             ✓ Jammer simulator
├── frontend/
│   ├── package.json              ✓ NPM packages
│   ├── tsconfig.json             ✓ TypeScript config
│   ├── vite.config.ts            ✓ Vite config
│   ├── node_modules/             ✓ NPM dependencies
│   └── src/
│       ├── lib/
│       │   └── api.ts            ✓ API service (NEW)
│       └── app/
│           ├── components/
│           │   └── LiveCameraFeed.tsx     ✓ Updated with alert button
│           └── pages/
│               └── LiveDetection.tsx      ✓ Updated with alert button
└── logic/
    └── threat_engine.py
```

---

## 🔧 Troubleshooting

### ❌ "ModuleNotFoundError: No module named 'flask_cors'"

**Solution:** Install missing package:
```powershell
pip install flask-cors
```

### ❌ "Module not found" errors (frontend)

**Solution:** Make sure node_modules are installed:
```powershell
cd frontend
npm install
```

### ❌ "Port 5000 already in use"

**Solution:** Kill the process using port 5000:
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

Or use a different port:
```powershell
# In backend/app.py, change:
run_server(host='0.0.0.0', port=5001, debug=True)
```

### ❌ "SMTP Authentication Error"

**Solution:** 
1. Check email credentials in `.env` file
2. For Gmail: Use [App Password](https://myaccount.google.com/apppasswords) instead of regular password
3. Test credentials:
```powershell
python -c "
import smtplib
from dotenv import load_dotenv
import os

load_dotenv()
try:
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(os.getenv('SENDER_EMAIL'), os.getenv('SENDER_PASSWORD'))
    print('✓ Email credentials OK')
    server.quit()
except Exception as e:
    print(f'✗ Error: {e}')
"
```

### ❌ "Email not received?"

**Checklist:**
1. [ ] Backend is running (check Terminal 1)
2. [ ] Frontend can reach backend (check browser console - F12 > Console)
3. [ ] Email credentials are valid (run test above)
4. [ ] Check spam/junk folder in email client
5. [ ] Wait 10-30 seconds (SMTP can be slow)

**Debug:** Watch backend console for email logs:
```
[EMAIL] Preparing email alert...
[EMAIL] Connecting to SMTP server smtp.gmail.com:587...
[EMAIL] TLS connection established
[EMAIL] Authenticating as aeroguard.ai09@gmail.com...
[EMAIL] Sending alert to hehe.795.12@gmail.com...
[EMAIL] ✓ Email alert sent successfully!
```

### ❌ "Frontend at localhost:5173 shows blank page"

**Solution:**
1. Check browser console (F12 > Console) for errors
2. Hard refresh: Ctrl+Shift+R (Windows)
3. Clear cache: Delete `frontend/.vite` folder
4. Rebuild: `cd frontend && npm run build`

### ❌ "CORS Error in browser console"

**Issue:** Request blocked by CORS policy

**Solution:** Backend CORS is already configured, but verify:
```python
# In backend/app.py, this line should exist:
CORS(app, resources={r"/api/*": {"origins": "*"}})
```

---

## 📊 Testing Workflow

### Backend Only (No Frontend)
```powershell
python backend/email_alert.py
```
This directly tests email sending without the frontend.

### Frontend API Call Testing
```javascript
// Open browser console (F12 > Console) and paste:
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(d => console.log(d))
```
Should see: `{"status": "operational", ...}`

### Full Threat Response Test
```javascript
// In browser console:
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

Expected response:
```json
{
  "status": "success",
  "message": "Threat response activated",
  "actions": {
    "jammer": "ACTIVATED",
    "email_alert": "SENT"
  }
}
```

---

## 📧 Email Alert Flow

```
User clicks "Test Threat Alert" button
    ↓
Frontend API call: POST /api/trigger
    ↓
Backend receives detection data
    ↓
├─ Phase 1: Activate jammer (simulated)
├─ Phase 2: Send email alert
│   ├─ email_alert.py receives request
│   ├─ Creates MIME message
│   ├─ Connects to SMTP server
│   ├─ Authenticates with credentials
│   └─ Sends email to RECIPIENT_EMAIL
└─ Phase 3: Log threat to threat_log
    ↓
Return success response to frontend
    ↓
User sees "✓ Threat alert sent! Check your email."
    ↓
🎉 Email arrives with threat details
```

---

## 🔑 Email Configuration Details

### Gmail Setup Instructions

1. **Enable 2-Factor Authentication:**
   - Go to [Gmail Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification

2. **Create App Password:**
   - Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
   - Select "App": Mail
   - Select "Device": Windows Computer
   - Get a 16-character password

3. **Update .env file:**
```dotenv
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your.email@gmail.com
SENDER_PASSWORD=xxxx xxxx xxxx xxxx
RECIPIENT_EMAIL=where.alerts.go@gmail.com
```

---

## 🚀 Production Deployment

### Build Frontend
```powershell
cd frontend
npm run build
```

Creates `frontend/dist/` folder with optimized assets.

### Run Production Server
```powershell
cd C:\Users\Aadya\OneDrive\Desktop\AeroGuardAI

# Backend serves both API and frontend
python backend/app.py
```

Open browser: `http://localhost:5000`

---

## 📚 File Structure Reference

```
AeroGuardAI/
├── backend/                      ← Flask API server
│   ├── app.py                    ← Main Flask app (run this!)
│   ├── email_alert.py            ← Email notification service
│   ├── jammer_sim.py             ← Jammer simulator
│   └── __init__.py
│
├── frontend/                     ← React web interface
│   ├── src/
│   │   ├── lib/
│   │   │   └── api.ts            ← API utility (NEW)
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   └── LiveCameraFeed.tsx      ← Alert button (UPDATED)
│   │   │   └── pages/
│   │   │       └── LiveDetection.tsx       ← Alert button (UPDATED)
│   │   └── main.tsx
│   ├── package.json              ← NPM dependencies
│   ├── tsconfig.json             ← TypeScript config
│   ├── vite.config.ts            ← Vite config (path aliases!)
│   └── dist/                     ← Built frontend (after npm run build)
│
├── logic/                        ← Threat evaluation
│   └── threat_engine.py
│
├── vision/                       ← YOLOv8 detection
│   ├── detect_live.py
│   └── train_yolo.py
│
├── .env                          ← Environment variables (EMAIL CONFIG!)
├── requirements.txt              ← Python packages
└── README.md
```

---

## 💡 Key Points

✅ **Backend** runs on port `5000`
✅ **Frontend dev server** runs on port `5173`
✅ API calls use `/api/` prefix
✅ Email config in `.env` file
✅ CORS fully enabled for development
✅ Path alias `@/` points to `frontend/src/`

---

## 🆘 Need Help?

1. **Check logs in terminal** - Look for error messages
2. **Open browser console** - F12 > Console tab
3. **Verify .env file** - Make sure email is configured
4. **Test email directly** - Run `python backend/email_alert.py`
5. **Restart both servers** - Kill and restart backend & frontend

---

**Last Updated:** February 6, 2026
**Created for:** AeroGuard AI v1.0
