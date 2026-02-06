# Email Alert Fix - Frontend Integration

## Problem Solved ✓

The frontend was **not triggering the `/api/trigger` endpoint**, so alerts were never being sent automatically. Now the issue is fixed!

## What Changed

### 1. **New API Service** (`frontend/src/lib/api.ts`)
- Created centralized API utility for all backend calls
- Handles errors and manages request/response format
- Makes it easy to call the backend from any component

### 2. **Updated LiveCameraFeed Component** 
- Added "Test Threat Alert" button
- Button sends detection data to the backend
- Shows real-time feedback (success/failure message)

### 3. **Updated LiveDetection Page**
- Added "Test Threat Alert" button  
- Same functionality as LiveCameraFeed
- Integrated seamlessly into the UI

## How to Test Email Alerts

### Step 1: Start the Backend Server
```powershell
cd C:\Users\Aadya\OneDrive\Desktop\AeroGuardAI
python backend/app.py
```
You should see:
```
[FLASK] Running on http://localhost:5000
[FLASK] WARNING: This is a development server...
```

### Step 2: Start the Frontend Development Server
Open a new terminal and run:
```powershell
cd C:\Users\Aadya\OneDrive\Desktop\AeroGuardAI\frontend
npm run dev
```
The frontend will be available at `http://localhost:5173`

### Step 3: Test Email Alerts from Frontend
Navigate to one of these pages:
- **Dashboard** → Live Camera Feed component
- **Live Detection** page

You'll see a **red "Test Threat Alert" button**

Click the button and:
- ✅ You should receive an email within 10-30 seconds
- ✅ The button shows "Sending..." while processing
- ✅ Success message appears: "✓ Threat alert sent! Email should arrive shortly."

### Step 4: Verify Email Received
Check the email account configured in your `.env` file:
```
RECIPIENT_EMAIL=your_email@gmail.com
```

You should receive an email with:
- Subject: 🚨 UNAUTHORIZED DRONE DETECTED - AeroGuard AI
- Detection details (confidence level, timestamp)
- Action taken message

---

## File Structure Changes

```
frontend/src/
├── lib/
│   └── api.ts              ← NEW: API utility for backend calls
└── app/
    ├── components/
    │   └── LiveCameraFeed.tsx   ← UPDATED: Added alert trigger
    └── pages/
        └── LiveDetection.tsx     ← UPDATED: Added alert trigger
```

---

## How the Workflow Works Now

```
1. User clicks "Test Threat Alert" button in frontend
   ↓
2. Frontend calls: fetch('/api/trigger', {...})
   ↓
3. Backend receives request in /api/trigger endpoint
   ↓
4. Backend triggers email alert via email_alert.py
   ↓
5. SMTP sends email to configured recipient
   ↓
6. User receives notification email ✓
```

---

## API Endpoint Details

### POST `/api/trigger`

**Request Body:**
```json
{
  "threat_detected": true,
  "detection": {
    "class_name": "drone",
    "confidence": 0.92,
    "bbox": [x1, y1, x2, y2],
    "timestamp": "2026-02-06T10:30:45.123Z",
    "threat_level": "HIGH"
  }
}
```

**Success Response (200):**
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

## Troubleshooting

### ❌ Email Not Received?

1. **Backend not running?**
   ```powershell
   # Check if Flask is running
   python backend/app.py
   ```

2. **Email credentials not configured?**
   - Check `.env` file for:
     ```
     SENDER_EMAIL=your_email@gmail.com
     SENDER_PASSWORD=your_app_password
     RECIPIENT_EMAIL=alert@example.com
     ```
   - For Gmail, use an [App Password](https://myaccount.google.com/apppasswords), not your main password

3. **Button click not working?**
   - Check browser console (F12) for errors
   - Verify backend is running on `http://localhost:5000`
   - Check CORS settings in `backend/app.py`

4. **Firewall blocking SMTP?**
   - Test SMTP connection manually:
     ```powershell
     python -c "import smtplib; s = smtplib.SMTP('smtp.gmail.com', 587); s.starttls(); print('OK')"
     ```

### ✅ Quick Test from Backend

You can still test manually without the frontend:
```powershell
python backend/email_alert.py
```
This directly calls `send_alert()` and should work fine.

---

## Advanced: Monitor Email Sending

Watch the backend console for detailed logs:
```
[EMAIL] Preparing email alert...
[EMAIL] Connecting to SMTP server smtp.gmail.com:587...
[EMAIL] TLS connection established
[EMAIL] Authenticating as your_email@gmail.com...
[EMAIL] Sending alert to alert@example.com...
[EMAIL] ✓ Email alert sent successfully! (Total sent: 1)
```

---

## Summary

✅ **Frontend → Backend API integration working**
✅ **Email alerts now send automatically from UI** 
✅ **Real-time feedback for user actions**
✅ **Backward compatible with manual testing**

You can now trigger email alerts directly from the web interface! 🎉
