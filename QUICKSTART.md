# AeroGuard AI - Quick Start Guide

## 🚀 5-Minute Quick Start

### Step 1: Install Dependencies
```powershell
cd c:\Users\Aadya\OneDrive\Desktop\AeroGuardAI
pip install -r requirements.txt
```

### Step 2: Configure Email (Optional)
```powershell
# Copy environment template
Copy-Item .env.example .env

# Edit with your email credentials
notepad .env
```

**For Gmail:**
1. Enable 2-Factor Authentication: https://myaccount.google.com/
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Copy the 16-character password to `.env` as `SENDER_PASSWORD`

### Step 3: Train Model (First Time Only)
```powershell
python vision/train_yolo.py
```
⏱️ Time: 30-60 minutes (CPU) or 10-20 minutes (GPU)

After training completes:
- Best weights: `runs/detect/train/weights/best.pt` ✓

### Step 4: Start Backend Server
```powershell
python backend/app.py
```

Server output:
```
[FLASK] AeroGuard AI Backend Server Starting
[FLASK] Host: localhost
[FLASK] Port: 5000
 * Running on http://localhost:5000
```

Keep this terminal open.

### Step 5: Run Live Detection
```powershell
# In a NEW terminal window
cd c:\Users\Aadya\OneDrive\Desktop\AeroGuardAI
python vision/detect_live.py
```

You should see:
```
[DETECTION] Initializing live detection pipeline...
[MODEL] Loading trained weights from runs/detect/train/weights/best.pt
[DETECTION] Pipeline started. Press 'q' to exit.
```

Press `q` to exit.

---

## 📊 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    AeroGuard AI System                       │
└─────────────────────────────────────────────────────────────┘

                     SEE-THINK-ACT Pipeline
                     
    ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
    │   SEE        │      │   THINK      │      │    ACT       │
    │              │      │              │      │              │
    │ YOLOv8n      │  →   │   Threat     │  →   │  Jammer +    │
    │ Detection    │      │   Engine     │      │  Email       │
    └──────────────┘      └──────────────┘      └──────────────┘
         ↓                      ↓                      ↓
    [detect_live.py]   [threat_engine.py]       [app.py]
         ↓                      ↓                      ↓
      Webcam              0.75-0.85 conf          Flask API
    Real-time           Classification           REST Endpoints
```

---

## 📁 Project Files

### Core Modules

#### 🎥 [vision/detect_live.py](vision/detect_live.py)
- **Purpose**: Real-time drone detection from webcam
- **Main Function**: `run_detection_pipeline(source=0)`
- **Confidence Threshold**: 0.75 (configurable)
- **Output**: Annotated video stream + detection logs
- **Run**: `python vision/detect_live.py`

#### 🧠 [logic/threat_engine.py](logic/threat_engine.py)
- **Purpose**: Threat evaluation and classification
- **Threat Levels**:
  - NONE: confidence < 0.75
  - LOW: 0.75 ≤ confidence < 0.80
  - MEDIUM: 0.80 ≤ confidence < 0.85 → triggers API
  - HIGH: confidence ≥ 0.85 → triggers API
- **Main Function**: `evaluate_threat(detection_data)` → returns "LOW"/"MEDIUM"/"HIGH"

#### 🔌 [backend/app.py](backend/app.py)
- **Purpose**: Flask REST API for countermeasure control
- **Port**: 5000
- **Main Endpoint**: `POST /trigger` (threat response)
- **Key Endpoints**:
  - `GET /health` - Health check
  - `GET /status` - System status
  - `GET /threat-log` - View threat history
  - `POST /jammer/deactivate` - Manual jammer control
- **Run**: `python backend/app.py`

#### 🎯 [backend/jammer_sim.py](backend/jammer_sim.py)
- **Purpose**: Simulated jammer (no real RF hardware)
- **Main Function**: `activate_jammer()`
- **Output**: Console simulation logs
- **Note**: Educational/simulation only - no dangerous functionality

#### 📧 [backend/email_alert.py](backend/email_alert.py)
- **Purpose**: Send email notifications for threats
- **Main Function**: `send_alert(detection_data)`
- **Configuration**: `.env` file
- **Email Format**: HTML + Plain text
- **SMTP**: Gmail (configurable to other providers)

#### 🏋️ [vision/train_yolo.py](vision/train_yolo.py)
- **Purpose**: Train YOLOv8n model on VisDrone dataset
- **Main Function**: `train_yolo_model()`
- **Output**: Weights saved to `runs/detect/train/weights/best.pt`
- **Run**: `python vision/train_yolo.py`

---

## 🔧 Configuration Files

### [vision/visdrone.yaml](vision/visdrone.yaml)
Dataset configuration for YOLOv8 training:
```yaml
path: datasets/VisDrone
train: images/train
val: images/val
nc: 1                    # Single class (drone)
names:
  - drone               # Class name
```

### [.env.example](.env.example) → [.env](.env)
Email configuration (copy to `.env` and fill in your credentials):
```env
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your_email@gmail.com
SENDER_PASSWORD=your_app_password
RECIPIENT_EMAIL=alert@example.com
```

---

## 📡 API Endpoints

### GET /health
Health check - verify API is running
```bash
curl http://localhost:5000/health
```
Response:
```json
{
    "status": "operational",
    "service": "AeroGuard AI Backend",
    "timestamp": "2026-02-03T10:30:45",
    "version": "1.0.0"
}
```

### POST /trigger (Main Threat Response)
Called by threat_engine when threat is confirmed
```bash
curl -X POST http://localhost:5000/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "threat_detected": true,
    "detection": {
      "class_name": "drone",
      "confidence": 0.92,
      "bbox": [150, 100, 450, 400],
      "timestamp": "2026-02-03T10:30:45"
    }
  }'
```

Response:
```json
{
    "status": "success",
    "message": "Threat response activated",
    "actions": {
        "jammer": "ACTIVATED",
        "email_alert": "SENT"
    },
    "threat_entry": {...},
    "timestamp": "2026-02-03T10:30:45"
}
```

### GET /status
System status
```bash
curl http://localhost:5000/status
```

### GET /threat-log
View all threats logged since startup
```bash
curl http://localhost:5000/threat-log
```

### DELETE /threat-log
Clear threat history
```bash
curl -X DELETE http://localhost:5000/threat-log
```

---

## 🧪 Testing Without Live Webcam

### Test Jammer Simulation
```powershell
python backend/jammer_sim.py
```

### Test Email Alert
```powershell
python backend/email_alert.py
```

### Test Flask API (PowerShell)
```powershell
# Start server first in another terminal: python backend/app.py

$payload = @{
    threat_detected = $true
    detection = @{
        class_name = "drone"
        confidence = 0.92
        bbox = @(150, 100, 450, 400)
        timestamp = Get-Date -Format o
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/trigger" `
                  -Method POST `
                  -Body $payload `
                  -ContentType "application/json" | ConvertTo-Json
```

---

## ⚠️ Troubleshooting

### "No module named X"
```powershell
# Reinstall all dependencies
pip install --upgrade -r requirements.txt
```

### "Flask is not running"
Make sure you ran:
```powershell
python backend/app.py
```
in a separate terminal and it's still running.

### "SMTP Authentication Error"
- Verify email/password in `.env`
- Use Gmail App Password (not regular password)
- Enable 2FA on Gmail account
- Check credentials are not hardcoded (use `.env` only)

### "Cannot open video source (webcam not detected)"
- Ensure webcam is connected
- Close other apps using webcam
- Test webcam with Windows Camera app first

### "best.pt not found"
Run training first:
```powershell
python vision/train_yolo.py
```

---

## 📊 Expected Output Example

### Live Detection Console
```
[DETECTION] Initializing live detection pipeline...
[MODEL] Loading trained weights from runs/detect/train/weights/best.pt
[DETECTION] Pipeline started. Press 'q' to exit.
[DETECTION] DRONE detected
  └─ Confidence: 92.00%
  └─ Location: (150, 100) → (450, 400)
  └─ Timestamp: 2026-02-03T10:30:45.123456
[THREAT-ENGINE] Evaluating detection...
[THREAT-ENGINE] Threat level: HIGH
[THREAT-ENGINE] Action: ACTIVATE_COUNTERMEASURE
[THREAT-ENGINE] INITIATING COUNTERMEASURE SEQUENCE...
[API] Sending threat trigger to http://localhost:5000/trigger
[API] Successfully triggered: {"status": "success", ...}
```

### Flask Server Console
```
[FLASK] ==================================================
[FLASK] THREAT RESPONSE ENDPOINT TRIGGERED
[FLASK] ==================================================
[FLASK] Threat detected: True
[FLASK] Detection class: drone
[FLASK] Confidence: 92.00%
[FLASK] ==================================================
[FLASK] INITIATING COUNTERMEASURE SEQUENCE
[FLASK] ==================================================
[FLASK] [PHASE 1] Activating anti-drone jammer...
[JAMMER] ============================================================
[JAMMER] ANTI-DRONE JAMMER SIMULATION ACTIVATED
...
[FLASK] [PHASE 2] Sending threat notification...
[EMAIL] ✓ Email alert sent successfully!
```

---

## 🔐 Security Notes

1. **Never commit `.env` file** to version control
2. **Use App Passwords** for Gmail, not your main password
3. **Enable 2FA** on email accounts
4. **In production**: Add API authentication, use HTTPS
5. **Log review**: Check logs regularly for security events

---

## 📚 Full Documentation

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for comprehensive documentation including:
- Detailed architecture
- Module documentation
- API reference
- Dataset preparation
- Performance tuning
- Production deployment

---

## 🎯 Next Steps

1. ✅ Install dependencies: `pip install -r requirements.txt`
2. ✅ Configure email: Edit `.env`
3. ✅ Train model: `python vision/train_yolo.py` (optional if using pretrained)
4. ✅ Start server: `python backend/app.py`
5. ✅ Run detection: `python vision/detect_live.py`
6. 🎉 Watch it detect drones!

---

**AeroGuard AI v1.0.0** | February 2026
