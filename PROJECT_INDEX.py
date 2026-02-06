"""
AeroGuard AI - Complete Project Index & Navigation Guide
Master directory of all files, their purpose, and quick access
"""

# ==============================================================================
# PROJECT ROOT FILES
# ==============================================================================

ROOT_FILES = {
    "README.md": {
        "purpose": "Main project overview and features",
        "size": "~420 lines",
        "read_time": "5 minutes",
        "start_here": True
    },
    
    "QUICKSTART.md": {
        "purpose": "5-minute quick start guide",
        "size": "~280 lines",
        "read_time": "3-5 minutes",
        "priority": "HIGH"
    },
    
    "SETUP_GUIDE.md": {
        "purpose": "Comprehensive setup and configuration guide",
        "size": "~600 lines",
        "read_time": "15 minutes",
        "sections": [
            "Prerequisites",
            "Installation",
            "Configuration",
            "Module Documentation",
            "API Reference",
            "Testing",
            "Troubleshooting"
        ]
    },
    
    "IMPLEMENTATION_SUMMARY.md": {
        "purpose": "Summary of all implemented features and deliverables",
        "size": "~400 lines",
        "read_time": "10 minutes",
        "useful_for": "Understanding what was built"
    },
    
    "CONFIG_REFERENCE.py": {
        "purpose": "Configuration parameters and thresholds reference",
        "size": "~350 lines",
        "type": "Python configuration file",
        "useful_for": "Tuning system parameters"
    },
    
    "requirements.txt": {
        "purpose": "Python package dependencies",
        "packages": 10,
        "install_command": "pip install -r requirements.txt"
    },
    
    ".env.example": {
        "purpose": "Email configuration template",
        "action": "Copy to .env and fill in credentials",
        "variables": [
            "SMTP_SERVER",
            "SMTP_PORT",
            "SENDER_EMAIL",
            "SENDER_PASSWORD",
            "RECIPIENT_EMAIL"
        ]
    },
    
    "verify_imports.py": {
        "purpose": "Verify all imports work correctly",
        "run_command": "python verify_imports.py",
        "tests": 6,
        "run_before": "First use"
    },
    
    "yolov8n.pt": {
        "purpose": "Pretrained YOLOv8n weights",
        "size": "~6 MB",
        "use": "Fallback model if training not completed"
    }
}

# ==============================================================================
# VISION MODULE (vision/)
# ==============================================================================

VISION_MODULE = {
    "detect_live.py": {
        "purpose": "Real-time drone detection from webcam",
        "type": "Main executable",
        "run_command": "python vision/detect_live.py",
        "key_functions": [
            "load_model()",
            "run_detection_pipeline(source=0, confidence_threshold=0.75)"
        ],
        "features": [
            "Loads trained best.pt model",
            "Webcam real-time inference",
            "Single-class 'drone' detection",
            "Confidence threshold: 0.75",
            "Threat evaluation integration",
            "Bounding box annotation",
            "Color-coded threat visualization",
            "Frame statistics"
        ],
        "lines_of_code": 175,
        "complexity": "MEDIUM"
    },
    
    "train_yolo.py": {
        "purpose": "Train YOLOv8n on VisDrone dataset",
        "type": "Training script",
        "run_command": "python vision/train_yolo.py",
        "key_functions": [
            "train_yolo_model()"
        ],
        "config": {
            "model": "YOLOv8n (nano)",
            "dataset": "VisDrone (single-class)",
            "epochs": 100,
            "image_size": 640,
            "batch_size": 16,
            "optimizer": "SGD"
        },
        "output": "runs/detect/train/weights/best.pt",
        "duration": "30-60 min (CPU), 10-20 min (GPU)",
        "lines_of_code": 53,
        "complexity": "LOW"
    },
    
    "detect_live.py__import": {
        "usage": "from vision.detect_live import run_detection_pipeline",
        "callable": "run_detection_pipeline(source=0, confidence_threshold=0.75)"
    },
    
    "visdrone.yaml": {
        "purpose": "Dataset configuration for YOLOv8",
        "format": "YAML",
        "content": [
            "Dataset path",
            "Train/val split",
            "Number of classes: 1 (drone)",
            "Class name: drone"
        ]
    },
    
    "__init__.py": {
        "purpose": "Vision module initialization",
        "type": "Package marker"
    },
    
    "dataset/": {
        "purpose": "VisDrone dataset container",
        "structure": "VisDrone/images/{train,val}/",
        "annotations": "YOLO format .txt files"
    }
}

# ==============================================================================
# LOGIC MODULE (logic/)
# ==============================================================================

LOGIC_MODULE = {
    "threat_engine.py": {
        "purpose": "Threat evaluation and classification engine",
        "type": "Core decision logic",
        "key_classes": [
            "ThreatEvaluator"
        ],
        "key_functions": [
            "evaluate_threat(detection_data) - Main API",
            "trigger_flask_api(detection_data)",
            "ThreatEvaluator.classify_threat(confidence)",
            "ThreatEvaluator.evaluate_detection(detection_data)"
        ],
        "threat_levels": {
            "NONE": "confidence < 0.75",
            "LOW": "0.75 <= conf < 0.80",
            "MEDIUM": "0.80 <= conf < 0.85",
            "HIGH": "conf >= 0.85"
        },
        "api_integration": "Calls Flask /trigger for MEDIUM/HIGH",
        "logging": "Full audit trail",
        "lines_of_code": 220,
        "complexity": "MEDIUM"
    },
    
    "threat_engine__import": {
        "usage": "from logic.threat_engine import evaluate_threat",
        "callable": "evaluate_threat(detection_data) -> str"
    },
    
    "__init__.py": {
        "purpose": "Logic module initialization",
        "type": "Package marker"
    }
}

# ==============================================================================
# BACKEND MODULE (backend/)
# ==============================================================================

BACKEND_MODULE = {
    "app.py": {
        "purpose": "Flask REST API server",
        "type": "Main application",
        "run_command": "python backend/app.py",
        "port": 5000,
        "endpoints": {
            "POST /trigger": "Main threat response endpoint",
            "GET /health": "Health check",
            "GET /status": "System status",
            "GET /threat-log": "View threat history",
            "DELETE /threat-log": "Clear threats",
            "POST /jammer/deactivate": "Manual jammer control"
        },
        "key_functions": [
            "trigger_response() - Main threat handler",
            "health_check()",
            "get_status()",
            "get_threat_log()",
            "manual_deactivate()"
        ],
        "features": [
            "Flask REST API",
            "Threat response coordination",
            "Jammer integration",
            "Email alert integration",
            "Threat logging",
            "Error handling",
            "JSON responses"
        ],
        "lines_of_code": 310,
        "complexity": "MEDIUM"
    },
    
    "jammer_sim.py": {
        "purpose": "Simulated anti-drone jammer",
        "type": "Countermeasure simulator",
        "run_command": "python backend/jammer_sim.py",
        "key_classes": [
            "JammerSimulator"
        ],
        "key_functions": [
            "activate_jammer() - Public API",
            "deactivate_jammer()",
            "get_jammer_status()",
            "JammerSimulator.activate()",
            "JammerSimulator.deactivate()"
        ],
        "features": [
            "Educational simulation",
            "No real RF hardware",
            "Realistic console logging",
            "Activation/deactivation sequences",
            "Statistics tracking",
            "Safe for all environments"
        ],
        "lines_of_code": 160,
        "complexity": "LOW"
    },
    
    "email_alert.py": {
        "purpose": "Email notifications for threats",
        "type": "Notification system",
        "key_classes": [
            "EmailAlertService"
        ],
        "key_functions": [
            "send_alert(detection_data) - Public API",
            "get_alert_stats()",
            "EmailAlertService.send_alert()",
            "EmailAlertService._validate_credentials()"
        ],
        "features": [
            "SMTP email integration",
            "Gmail support (App Passwords)",
            ".env credential management",
            "HTML + Plain text format",
            "Professional email template",
            "Error handling",
            "Delivery tracking"
        ],
        "configuration": {
            "smtp_server": "From .env (default: smtp.gmail.com)",
            "smtp_port": "From .env (default: 587)",
            "sender_email": "From .env",
            "sender_password": "From .env (use App Password)",
            "recipient_email": "From .env"
        },
        "lines_of_code": 290,
        "complexity": "MEDIUM"
    },
    
    "__init__.py": {
        "purpose": "Backend module initialization",
        "type": "Package marker"
    }
}

# ==============================================================================
# DOCUMENTATION FILES
# ==============================================================================

DOCUMENTATION = {
    "README.md": {
        "target_audience": "New users",
        "read_time": "5 minutes",
        "sections": [
            "Overview",
            "Features",
            "Architecture",
            "Requirements",
            "Quick Start",
            "Project Structure",
            "Module Overview",
            "Testing",
            "Troubleshooting",
            "Performance"
        ]
    },
    
    "QUICKSTART.md": {
        "target_audience": "Impatient users",
        "read_time": "3 minutes",
        "goal": "Get system running in 5 minutes",
        "includes": [
            "Step-by-step commands",
            "Expected output",
            "Common issues",
            "API testing examples"
        ]
    },
    
    "SETUP_GUIDE.md": {
        "target_audience": "Implementers",
        "read_time": "15 minutes",
        "depth": "Comprehensive",
        "includes": [
            "Detailed architecture",
            "Module documentation",
            "API reference",
            "Configuration guide",
            "Performance tuning",
            "Troubleshooting",
            "Production notes"
        ]
    },
    
    "IMPLEMENTATION_SUMMARY.md": {
        "target_audience": "Developers",
        "read_time": "10 minutes",
        "includes": [
            "What was built",
            "Code statistics",
            "Testing status",
            "Checklist",
            "Next steps"
        ]
    },
    
    "CONFIG_REFERENCE.py": {
        "target_audience": "Configurers",
        "type": "Python reference",
        "includes": [
            "Training config",
            "Detection config",
            "Threat thresholds",
            "Flask settings",
            "Email settings",
            "File paths",
            "Performance tuning"
        ]
    }
}

# ==============================================================================
# GETTING STARTED
# ==============================================================================

GETTING_STARTED_PATHS = {
    "First Time Users": {
        "step_1": "Read: README.md",
        "step_2": "Read: QUICKSTART.md",
        "step_3": "Run: pip install -r requirements.txt",
        "step_4": "Run: python verify_imports.py",
        "step_5": "Run: python backend/app.py",
        "step_6": "Run: python vision/detect_live.py (in new terminal)"
    },
    
    "Developers": {
        "step_1": "Read: SETUP_GUIDE.md",
        "step_2": "Review: CONFIG_REFERENCE.py",
        "step_3": "Study: Code structure",
        "step_4": "Review: API endpoints",
        "step_5": "Run: verify_imports.py",
        "step_6": "Modify: As needed"
    },
    
    "Data Scientists": {
        "step_1": "Read: SETUP_GUIDE.md (Vision section)",
        "step_2": "Review: vision/visdrone.yaml",
        "step_3": "Run: python vision/train_yolo.py",
        "step_4": "Monitor: runs/detect/train/results.csv",
        "step_5": "Evaluate: Model performance",
        "step_6": "Deploy: Run detect_live.py"
    },
    
    "System Integrators": {
        "step_1": "Read: SETUP_GUIDE.md (API section)",
        "step_2": "Review: backend/app.py endpoints",
        "step_3": "Test: API endpoints",
        "step_4": "Configure: .env for email",
        "step_5": "Integrate: With existing systems",
        "step_6": "Monitor: threat_log endpoint"
    }
}

# ==============================================================================
# QUICK REFERENCE COMMANDS
# ==============================================================================

QUICK_COMMANDS = {
    "Verify Installation": "python verify_imports.py",
    "Start Backend": "python backend/app.py",
    "Run Live Detection": "python vision/detect_live.py",
    "Train Model": "python vision/train_yolo.py",
    "Test Jammer": "python backend/jammer_sim.py",
    "Test Email": "python backend/email_alert.py",
    "Test API Health": "curl http://localhost:5000/health",
    "Get System Status": "curl http://localhost:5000/status",
    "View Threats": "curl http://localhost:5000/threat-log",
    "Clear Threats": "curl -X DELETE http://localhost:5000/threat-log"
}

# ==============================================================================
# FILE NAVIGATION TABLE
# ==============================================================================

"""
QUICK NAVIGATION:

Purpose                          File                                    Line Count
===============================================================================================
Introduction                    README.md                               420
Quick Setup (5 min)              QUICKSTART.md                           280
Detailed Guide                   SETUP_GUIDE.md                          600
Implementation Summary           IMPLEMENTATION_SUMMARY.md               400
Configuration Reference          CONFIG_REFERENCE.py                     350

Live Detection                   vision/detect_live.py                   175
Model Training                   vision/train_yolo.py                    53
Dataset Config                   vision/visdrone.yaml                    10

Threat Evaluation               logic/threat_engine.py                   220

REST API Server                  backend/app.py                          310
Jammer Simulation               backend/jammer_sim.py                   160
Email Notifications             backend/email_alert.py                  290

Import Verification             verify_imports.py                       180

Dependencies                     requirements.txt                         10
Email Config Template            .env.example                            12
Pretrained Model                 yolov8n.pt                              6 MB

TOTAL CODE: ~1,400 lines
TOTAL DOCS: ~1,650 lines
"""

# ==============================================================================
# FEATURE CHECKLIST
# ==============================================================================

FEATURES_IMPLEMENTED = {
    "Vision": [
        "✅ YOLOv8n real-time detection",
        "✅ Webcam/video input",
        "✅ Single-class drone detection",
        "✅ 0.75 confidence threshold",
        "✅ Bounding box annotation",
        "✅ Threat visualization (colors)"
    ],
    
    "Logic": [
        "✅ Threat classification (LOW/MED/HIGH)",
        "✅ Confidence-based thresholds",
        "✅ API decision making",
        "✅ Comprehensive logging"
    ],
    
    "Backend": [
        "✅ Flask REST API",
        "✅ /trigger endpoint",
        "✅ Health check",
        "✅ Status monitoring",
        "✅ Threat logging",
        "✅ Jammer simulation",
        "✅ Email alerts",
        "✅ Error handling"
    ],
    
    "Production": [
        "✅ Structured logging",
        "✅ Error handling",
        "✅ Configuration management",
        "✅ .env secrets",
        "✅ Documentation",
        "✅ Import verification",
        "✅ Code quality",
        "✅ Type hints"
    ]
}

# ==============================================================================
# TROUBLESHOOTING INDEX
# ==============================================================================

TROUBLESHOOTING_INDEX = {
    "Import Errors": "QUICKSTART.md or SETUP_GUIDE.md - Troubleshooting section",
    "Webcam Issues": "SETUP_GUIDE.md - Troubleshooting / Cannot open video source",
    "Email Problems": "SETUP_GUIDE.md - Troubleshooting / SMTP Authentication Error",
    "API Not Working": "SETUP_GUIDE.md - Testing & Troubleshooting",
    "Model Not Found": "QUICKSTART.md - Testing & Verification",
    "Port Already Used": "CONFIG_REFERENCE.py or SETUP_GUIDE.md"
}

# ==============================================================================
# INDEX SUMMARY
# ==============================================================================

def print_summary():
    """Print project summary"""
    print("""
    ╔════════════════════════════════════════════════════════════════════════════╗
    ║                      AeroGuard AI - Project Index                          ║
    ║         Complete Autonomous Drone Detection & Countermeasure System        ║
    ╚════════════════════════════════════════════════════════════════════════════╝
    
    📚 DOCUMENTATION (Start Here)
    ├─ README.md ..................... Project overview (5 min read)
    ├─ QUICKSTART.md ................. 5-minute setup guide
    ├─ SETUP_GUIDE.md ................ Comprehensive guide
    └─ IMPLEMENTATION_SUMMARY.md ..... What was built
    
    💻 CORE MODULES
    ├─ vision/
    │  ├─ detect_live.py ............ Real-time detection
    │  ├─ train_yolo.py ............ Model training
    │  └─ visdrone.yaml ............ Dataset config
    │
    ├─ logic/
    │  └─ threat_engine.py .......... Threat evaluation
    │
    └─ backend/
       ├─ app.py ................... Flask REST API
       ├─ jammer_sim.py ............ Jammer simulation
       └─ email_alert.py ........... Email notifications
    
    ⚙️ CONFIGURATION
    ├─ requirements.txt ............. Python dependencies
    ├─ .env.example ................ Email config template
    ├─ CONFIG_REFERENCE.py ......... Configuration reference
    └─ vision/visdrone.yaml ....... Dataset config
    
    🧪 UTILITIES
    ├─ verify_imports.py ............ Import verification
    └─ yolov8n.pt ................... Pretrained model
    
    📈 STATISTICS
    ├─ Total Code Lines: ~1,400
    ├─ Total Docs Lines: ~1,650
    ├─ Total Files: 20+
    └─ Features: 30+
    
    🚀 QUICK START
    1. pip install -r requirements.txt
    2. python verify_imports.py
    3. python backend/app.py
    4. python vision/detect_live.py (new terminal)
    
    📖 RECOMMENDED READING ORDER
    1. README.md (overview)
    2. QUICKSTART.md (setup)
    3. SETUP_GUIDE.md (details)
    4. CONFIG_REFERENCE.py (tuning)
    
    ✅ ALL FEATURES IMPLEMENTED AND TESTED
    """)

if __name__ == "__main__":
    print_summary()
