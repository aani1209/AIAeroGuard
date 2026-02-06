# AeroGuard AI - Complete Setup & Usage Guide

## Project Overview

AeroGuard AI is a fully autonomous drone detection and countermeasure system implementing a **SEE-THINK-ACT** pipeline:

- **SEE**: Real-time drone detection using YOLOv8n
- **THINK**: Threat evaluation and classification engine
- **ACT**: Automated countermeasure activation (jammer + alerts)

---

## System Architecture

```
Vision Module              Threat Engine          Backend API
    ↓                          ↓                       ↓
[detect_live.py] ──→ [threat_engine.py] ──→ [app.py]
     ↓                         ↓                   ↓
YOLOv8 Detection         Threat Classification   Countermeasures
   (0.75 conf)          (LOW/MEDIUM/HIGH)       ├─ Jammer
                                                 └─ Email Alert
```

---

## Prerequisites

### System Requirements
- Python 3.8+
- Windows 10/11 (PowerShell)
- Webcam (for live detection)
- NVIDIA GPU (optional, CPU-compatible)

### Dependencies
All required packages are listed in `requirements.txt`:
```
Flask==3.0.0
ultralytics==8.0.231
torch==2.1.2
torchvision==0.16.2
opencv-python==4.8.1.78
numpy==1.24.3
pillow==10.1.0
pyyaml==6.0.1
python-dotenv==1.0.0
requests==2.31.0
```

---

## Installation & Setup

### 1. Install Dependencies

```powershell
# Navigate to project directory
cd c:\Users\Aadya\OneDrive\Desktop\AeroGuardAI

# Install all required packages
pip install -r requirements.txt
```

### 2. Configure Email Alerts

Copy `.env.example` to `.env` and fill in your credentials:

```powershell
# Copy template
Copy-Item .env.example .env

# Edit .env with your email credentials
notepad .env
```

**Gmail Setup Instructions:**
1. Go to https://myaccount.google.com/
2. Navigate to "Security" → "App passwords"
3. Generate an app password for "Mail" on "Windows Computer"
4. Use this 16-character password in `.env` as `SENDER_PASSWORD`

### 3. Prepare Dataset

The VisDrone dataset structure is already configured in `vision/visdrone.yaml`:
```
vision/dataset/VisDrone/images/
├── train/
│   └── VisDrone2019-VID-train/
│       ├── annotations/  (*.txt files)
│       └── sequences/
└── val/
    └── VisDrone2019-DET-val/
        ├── annotations/
        └── images/
```

Each `.txt` annotation file contains drone bounding boxes in YOLO format:
```
<class_id> <x_center> <y_center> <width> <height>
```

For single-class drone detection: `class_id = 0`

---

## Module Documentation

### 1. `vision/train_yolo.py` - Training Module

**Purpose**: Train YOLOv8n on VisDrone drone detection dataset

**Configuration**:
- Model: YOLOv8n (nano - fast, lightweight)
- Dataset: VisDrone (single-class: drone)
- Epochs: 100
- Image size: 640×640
- Batch size: 16
- Optimizer: SGD

**Run Training**:
```powershell
python vision/train_yolo.py
```

**Output**:
- Trained weights: `runs/detect/train/weights/best.pt`
- Training logs: `runs/detect/train/`

**Key Features**:
- CPU-compatible (auto GPU detection)
- Early stopping with patience=20
- Augmentation enabled
- Pretrained weights initialization

---

### 2. `vision/detect_live.py` - Live Detection Module

**Purpose**: Real-time drone detection from webcam with threat evaluation

**Configuration**:
- Model: `runs/detect/train/weights/best.pt` (trained) or `yolov8n.pt` (pretrained)
- Confidence threshold: 0.75
- Class: "drone" only
- Threat evaluation: YES
- API triggering: YES (if threat confirmed)

**Run Detection**:
```powershell
python vision/detect_live.py
```

**Controls**:
- Press `q` to exit
- Bounding box colors:
  - Green: LOW threat
  - Orange: MEDIUM threat
  - Red: HIGH threat

**Output**:
- Real-time annotated video stream
- Console detection logs
- API calls for threats MEDIUM/HIGH
- Detection statistics on exit

---

### 3. `logic/threat_engine.py` - Threat Evaluation Engine

**Purpose**: Threat classification and decision logic (THINK phase)

**Threat Classification**:
```
Confidence < 0.75    → NO ACTION
0.75 ≤ Conf < 0.80   → LOW threat → MONITOR
0.80 ≤ Conf < 0.85   → MEDIUM threat → ESCALATE_ALERT + API
Conf ≥ 0.85          → HIGH threat → ACTIVATE_COUNTERMEASURE + API
```

**Main Functions**:

#### `evaluate_threat(detection_data)`
- Accepts detection from vision module
- Returns threat level: "LOW", "MEDIUM", "HIGH", or "NONE"
- Triggers Flask API for MEDIUM/HIGH threats
- Logs all evaluations

**Detection Data Format**:
```python
{
    "class_name": "drone",           # Detected class
    "confidence": 0.92,              # Detection confidence (0-1)
    "bbox": [x1, y1, x2, y2],       # Bounding box coordinates
    "timestamp": "2026-02-03T10:30:45.123456",
    "frame_id": 142                  # Frame number
}
```

**Implementation Details**:
- Stateless evaluation (can be called repeatedly)
- Thread-safe logging
- Configurable thresholds
- Fallback to pretrained model if best.pt unavailable

---

### 4. `backend/app.py` - Flask REST API

**Purpose**: REST API for countermeasure activation and monitoring (ACT phase)

**Port**: 5000 (configurable)

**Endpoints**:

#### `GET /health`
Health check endpoint
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

#### `POST /trigger`
**Main endpoint** - Activates countermeasures

Request:
```json
{
    "threat_detected": true,
    "detection": {
        "class_name": "drone",
        "confidence": 0.92,
        "bbox": [150, 100, 450, 400],
        "timestamp": "2026-02-03T10:30:45"
    }
}
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

#### `GET /status`
Get system status (jammer, email service)
```bash
curl http://localhost:5000/status
```

#### `GET /threat-log`
View all logged threats since startup
```bash
curl http://localhost:5000/threat-log
```

#### `DELETE /threat-log`
Clear threat history
```bash
curl -X DELETE http://localhost:5000/threat-log
```

#### `POST /jammer/deactivate`
Manually deactivate jammer (for testing)
```bash
curl -X POST http://localhost:5000/jammer/deactivate
```

---

### 5. `backend/jammer_sim.py` - Simulated Jammer

**Purpose**: Simulate anti-drone countermeasure without real RF hardware

**Features**:
- Console-based simulation
- Realistic operational logging
- Activation/deactivation sequences
- Statistics tracking
- NO real RF hardware or weapon functionality

**Classes**:

#### `JammerSimulator`
- `activate()` - Simulate jammer activation
- `deactivate()` - Simulate jammer shutdown
- `get_status()` - Get current status

**Public Functions**:
- `activate_jammer()` - Called by Flask API
- `get_jammer_status()` - Get status dictionary

**Simulation Output Example**:
```
[JAMMER] ============================================================
[JAMMER] ANTI-DRONE JAMMER SIMULATION ACTIVATED
[JAMMER] ============================================================
[JAMMER] Activation #1
[JAMMER] Timestamp: 2026-02-03T10:30:45.123456
[JAMMER] Status: Initializing RF countermeasure systems...
[JAMMER]   ✓ Frequency analysis complete
[JAMMER]   ✓ Target drone signature identified
[JAMMER]   ✓ Jamming pattern generated
[JAMMER]   ✓ RF output circuits energized
...
```

---

### 6. `backend/email_alert.py` - Email Notifications

**Purpose**: Send email alerts for confirmed threats

**Features**:
- SMTP integration with Gmail
- HTML + Plain text email bodies
- Configurable recipients
- Threat information in email
- .env credential management

**Classes**:

#### `EmailAlertService`
- `send_alert(detection_data)` - Send threat notification
- `get_alert_statistics()` - Get delivery stats

**Configuration** (in `.env`):
```
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your_email@gmail.com
SENDER_PASSWORD=your_app_password  # Use Gmail App Password
RECIPIENT_EMAIL=alert@example.com
```

**Email Template**:
- Subject: 🚨 UNAUTHORIZED DRONE DETECTED - AeroGuard AI
- Body includes:
  - Detection class
  - Confidence percentage
  - Threat level
  - Bounding box location
  - Actions taken (jammer activated, alerts sent)

---

## Complete Workflow Example

### Scenario: Live Drone Detection

1. **Start Backend Server** (Terminal 1):
```powershell
cd backend
python app.py
# Output: Running on http://localhost:5000
```

2. **Start Live Detection** (Terminal 2):
```powershell
cd vision
python detect_live.py
# Output: Pipeline started. Press 'q' to exit.
```

3. **Drone Appears in Frame**:
   - YOLOv8 detects with 0.89 confidence
   - threat_engine evaluates → HIGH threat
   - Threat evaluation calls Flask API

4. **Flask API Receives Threat**:
   - Activates jammer (simulated)
   - Sends email alert
   - Returns 200 OK

5. **User Receives**:
   - Console output with threat info
   - Email notification
   - Video annotation (red bounding box)

6. **Exit Detection** (Press 'q'):
   - Statistics printed
   - Graceful shutdown

---

## Testing & Troubleshooting

### Test Flask API (Without Live Detection)
```powershell
# Test health endpoint
curl http://localhost:5000/health

# Test threat trigger with simulated detection
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
                  -ContentType "application/json"
```

### Common Issues

**Issue**: "ModuleNotFoundError: No module named 'ultralytics'"
```powershell
# Solution: Reinstall requirements
pip install ultralytics --upgrade
```

**Issue**: "No module named 'flask'"
```powershell
# Solution: Install Flask
pip install Flask==3.0.0
```

**Issue**: "SMTP Authentication Error"
- Verify email and password in `.env`
- Use Gmail App Password (not regular password)
- Check 2FA is enabled on Gmail account

**Issue**: "Cannot open video source: 0"
- Ensure webcam is connected
- Check no other app is using the webcam
- Try specifying video file instead: `run_detection_pipeline(source="video.mp4")`

**Issue**: "best.pt not found"
- Run training first: `python vision/train_yolo.py`
- Or pretrained model will be auto-loaded

---

## Performance Tuning

### For CPU-Only Systems
Edit `train_yolo.py` and `detect_live.py`:
```python
model.train(device='cpu')  # Force CPU
model.predict(device='cpu')
```

### For Faster Detection
```python
model.predict(imgsz=416)  # Smaller size, faster inference
```

### For Higher Accuracy
```python
model.train(epochs=200, imgsz=1280)  # Larger size, slower but more accurate
```

---

## File Structure Summary

```
AeroGuardAI/
├── README.md                                    # This file
├── requirements.txt                             # Python dependencies
├── .env.example                                 # Email config template
├── yolov8n.pt                                   # Pretrained YOLOv8n weights
│
├── vision/                                      # Computer vision module
│   ├── __init__.py
│   ├── train_yolo.py                           # Training script
│   ├── detect_live.py                          # Live detection
│   ├── visdrone.yaml                           # Dataset config
│   └── dataset/                                 # VisDrone dataset
│       └── VisDrone/
│           ├── images/
│           │   ├── train/
│           │   └── val/
│           └── annotations/
│
├── logic/                                       # Decision engine
│   ├── __init__.py
│   └── threat_engine.py                        # Threat evaluation
│
├── backend/                                     # Flask backend
│   ├── __init__.py
│   ├── app.py                                  # Flask REST API
│   ├── jammer_sim.py                           # Simulated jammer
│   └── email_alert.py                          # Email notifications
│
├── runs/                                        # Training outputs
│   └── detect/
│       └── train/
│           ├── weights/
│           │   └── best.pt                     # Trained model
│           └── results.csv
│
└── n8n/                                         # Workflow automation (optional)
    └── workflow.json
```

---

## Security Notes

1. **Email Credentials**: Never commit `.env` to version control. Use `.env.example` template.
2. **API Security**: In production, add authentication to Flask endpoints.
3. **HTTPS**: Use HTTPS in production (configure Flask with SSL certificates).
4. **Logging**: Review logs regularly for security events.

---

## License & Disclaimer

This is an educational/simulation project demonstrating autonomous detection pipelines. The jammer is fully simulated with no real RF hardware functionality.

For production deployment, implement proper security, regulatory compliance, and professional testing.

---

## Support & Documentation

- YOLOv8 Docs: https://docs.ultralytics.com/
- Flask Docs: https://flask.palletsprojects.com/
- PyTorch: https://pytorch.org/
- VisDrone Dataset: https://github.com/VisDrone/VisDrone-Dataset

---

**Built with AeroGuard AI**
Version 1.0.0 | February 2026
