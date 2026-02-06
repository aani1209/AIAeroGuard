# AeroGuard AI - Autonomous Drone Detection & Countermeasure System

A fully autonomous drone detection and countermeasure system implementing a complete **SEE-THINK-ACT** pipeline with real-time inference, threat evaluation, and automated response.

## 🎯 Project Overview

AeroGuard AI is a production-ready Python backend that detects unauthorized drones using YOLOv8n and automatically triggers countermeasures:

- **SEE**: Real-time drone detection using YOLOv8n (confidence threshold: 0.75)
- **THINK**: Threat evaluation engine classifying threats as LOW/MEDIUM/HIGH
- **ACT**: Automated countermeasure activation (simulated jammer + email alerts)

### Key Features

✅ **Real-time Detection**: YOLOv8n inference on webcam/video streams  
✅ **Single-class Model**: Optimized for "drone" detection only  
✅ **Threat Intelligence**: Confidence-based threat classification  
✅ **REST API**: Flask backend with multiple endpoints  
✅ **Email Alerts**: SMTP notifications for confirmed threats  
✅ **Simulated Countermeasure**: Educational jammer simulation (no real RF)  
✅ **Windows Native**: Full PowerShell compatibility  
✅ **CPU-Compatible**: Trains and runs on CPU or GPU  
✅ **Production-Ready**: Comprehensive logging, error handling, and documentation  

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│           AeroGuard AI - SEE-THINK-ACT Pipeline             │
└─────────────────────────────────────────────────────────────┘

    VISION MODULE              LOGIC MODULE           BACKEND
    (vision/)                  (logic/)                (backend/)
        ↓                          ↓                        ↓
   ┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
   │ detect_live.py  │    │ threat_engine.py │    │   app.py        │
   │                 │    │                  │    │                 │
   │ • YOLOv8n model │ → │ • Threat classify│ → │ • Flask API     │
   │ • Webcam stream │    │ • LOW/MED/HIGH   │    │ • Jammer trigger│
   │ • 0.75 conf     │    │ • API trigger    │    │ • Email alerts  │
   └─────────────────┘    └──────────────────┘    └─────────────────┘
         ↓                                              ↓
    Real-time                                   ┌──────────────┐
    Detection                                  │ Countermeasures
                                               ├─ jammer_sim.py
                                               └─ email_alert.py
```

---

## 📋 Requirements

### System
- Python 3.8+
- Windows 10/11 (PowerShell)
- Webcam or video input device
- NVIDIA GPU (optional) - CPU supported

### Python Packages
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

## ⚡ Quick Start

### 1. Install Dependencies
```powershell
cd c:\Users\Aadya\OneDrive\Desktop\AeroGuardAI
pip install -r requirements.txt
```

### 2. Configure Email (Optional)
```powershell
Copy-Item .env.example .env
# Edit .env with your Gmail credentials
notepad .env
```

### 3. Train Model (First Time)
```powershell
python vision/train_yolo.py
```
⏱️ ~30-60 min (CPU) or ~10-20 min (GPU)

### 4. Start Backend
```powershell
python backend/app.py
```

### 5. Run Live Detection
```powershell
# In new terminal
python vision/detect_live.py
```

Press `q` to exit.

---

## 📁 Project Structure

```
AeroGuardAI/
│
├── README.md                          # This file
├── QUICKSTART.md                      # 5-minute setup guide
├── SETUP_GUIDE.md                     # Comprehensive documentation
├── requirements.txt                   # Python dependencies
├── .env.example                       # Email configuration template
├── verify_imports.py                  # Import verification script
├── yolov8n.pt                         # Pretrained YOLOv8n weights
│
├── vision/                            # Computer Vision Module
│   ├── __init__.py
│   ├── detect_live.py                 # ✅ Live detection from webcam
│   ├── train_yolo.py                  # ✅ YOLOv8 training
│   ├── visdrone.yaml                  # Dataset config (single-class drone)
│   └── dataset/                       # VisDrone dataset
│       └── VisDrone/
│           ├── images/
│           │   ├── train/
│           │   └── val/
│           └── annotations/
│
├── logic/                             # Decision Engine
│   ├── __init__.py
│   └── threat_engine.py               # ✅ Threat evaluation & classification
│
├── backend/                           # Flask REST API
│   ├── __init__.py
│   ├── app.py                         # ✅ Flask REST API server
│   ├── jammer_sim.py                  # ✅ Simulated countermeasure
│   └── email_alert.py                 # ✅ Email notifications
│
├── n8n/                               # Workflow automation (optional)
│   └── workflow.json
│
└── runs/                              # Training outputs (auto-created)
    └── detect/
        └── train/
            ├── weights/
            │   └── best.pt            # Trained model
            └── results.csv            # Training metrics
```

---

## 🚀 Modules

### Vision Module (`vision/`)

#### detect_live.py
**Real-time drone detection from webcam**
- Loads trained `best.pt` model (or pretrained fallback)
- Real-time inference from webcam
- Detects "drone" class only
- Confidence threshold: 0.75
- Threat evaluation integration
- Color-coded threat visualization

#### train_yolo.py
**Train YOLOv8n on VisDrone dataset**
- Model: YOLOv8n (nano)
- Dataset: VisDrone (single-class)
- Epochs: 100
- Output: `runs/detect/train/weights/best.pt`

### Logic Module (`logic/`)

#### threat_engine.py
**Threat evaluation and decision logic**
- Confidence-based threat classification
- Threat levels: LOW/MEDIUM/HIGH/NONE
- Automatic API triggering for MEDIUM/HIGH threats
- SEE-THINK-ACT pipeline implementation

### Backend Module (`backend/`)

#### app.py
**Flask REST API for countermeasure control**
- Port: 5000
- Main endpoint: `POST /trigger` (threat response)
- Health check: `GET /health`
- Status endpoint: `GET /status`
- Threat logging: `GET/DELETE /threat-log`

#### jammer_sim.py
**Simulated anti-drone countermeasure**
- Educational simulation (no real RF)
- Realistic operational logging
- Activation/deactivation sequences

#### email_alert.py
**Email notifications for threats**
- SMTP integration (Gmail)
- HTML + Plain text format
- Credential management via .env

---

## 🧪 Testing & Verification

### Verify Installation
```powershell
python verify_imports.py
```

### Test Individual Modules
```powershell
# Test jammer
python backend/jammer_sim.py

# Test email alert
python backend/email_alert.py
```

---

## 🔒 Security & Compliance

- ✅ **No real weapon functionality** - Jammer is fully simulated
- ✅ **Safe for all environments** - Console-based simulation only
- ✅ **Credential management** - Uses .env for secrets
- ✅ **Comprehensive logging** - All actions logged

---

## 📊 Performance

### Training
- CPU: ~1-2 hours per 100 epochs
- GPU: ~15-30 minutes per 100 epochs

### Inference
- CPU: ~50-100 ms per frame
- GPU: ~5-10 ms per frame

---

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - 5-minute setup
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Comprehensive guide

---

## ⚖️ License & Disclaimer

**Educational/Demonstration Project**

This system simulates drone detection and countermeasures for educational purposes only. The jammer is fully simulated with no real RF hardware.

Not for production deployment without proper regulatory compliance and professional review.

---

**AeroGuard AI v1.0.0** | Complete Autonomous Drone Detection System | February 2026
