"""
AeroGuard AI Configuration Summary
This file documents all configuration options and thresholds
"""

# ==============================================================================
# VISION MODULE CONFIGURATION
# ==============================================================================

# File: vision/train_yolo.py
TRAIN_CONFIG = {
    "model": "yolov8n",          # YOLOv8 nano (lightweight)
    "dataset_config": "vision/visdrone.yaml",
    "epochs": 100,
    "imgsz": 640,                # Image size for training
    "batch_size": 16,
    "device": 0,                 # 0 for GPU, 'cpu' for CPU only
    "optimizer": "SGD",
    "patience": 20,              # Early stopping patience
    "augment": True,             # Data augmentation
    "output_path": "runs/detect/train/weights/best.pt"
}

# File: vision/detect_live.py
DETECTION_CONFIG = {
    "model_path": "runs/detect/train/weights/best.pt",  # Trained weights
    "fallback_model": "yolov8n.pt",                      # Pretrained if above not found
    "confidence_threshold": 0.75,
    "class_name": "drone",       # Only detect drones
    "source": 0,                 # 0 for webcam, or path to video file
    "device": 0,                 # 0 for GPU, 'cpu' for CPU only
}

# ==============================================================================
# LOGIC MODULE CONFIGURATION
# ==============================================================================

# File: logic/threat_engine.py
THREAT_CONFIG = {
    "confidence_threshold": 0.75,        # Minimum to trigger action
    "medium_threat_confidence": 0.80,    # MEDIUM threat boundary
    "high_threat_confidence": 0.85,      # HIGH threat boundary
    
    "threat_levels": {
        "NONE": "confidence < 0.75",
        "LOW": "0.75 <= confidence < 0.80",
        "MEDIUM": "0.80 <= confidence < 0.85",  # → triggers API
        "HIGH": "confidence >= 0.85"             # → triggers API
    },
    
    "api_endpoint": "http://localhost:5000/trigger",
    "api_timeout": 5  # seconds
}

# ==============================================================================
# BACKEND MODULE CONFIGURATION
# ==============================================================================

# File: backend/app.py
FLASK_CONFIG = {
    "host": "localhost",
    "port": 5000,
    "debug": True,              # Development mode
    "json_sort_keys": False,
}

# File: backend/jammer_sim.py
JAMMER_CONFIG = {
    "simulation_only": True,    # Always simulation, no real RF
    "realistic_timing": True,   # Include realistic delays
    "log_output": True,         # Console logging enabled
    "activation_delay": 0.5,    # seconds
    "simulation_duration": 3.0  # seconds
}

# File: backend/email_alert.py
EMAIL_CONFIG = {
    "smtp_server": "smtp.gmail.com",
    "smtp_port": 587,
    "use_tls": True,
    "sender_email": "CONFIGURE_IN_ENV",      # Set in .env
    "sender_password": "CONFIGURE_IN_ENV",   # Set in .env (App Password)
    "recipient_email": "CONFIGURE_IN_ENV",   # Set in .env
    "email_subject": "🚨 UNAUTHORIZED DRONE DETECTED - AeroGuard AI",
    "email_format": ["text/plain", "text/html"]
}

# ==============================================================================
# DATASET CONFIGURATION
# ==============================================================================

# File: vision/visdrone.yaml
DATASET_CONFIG = {
    "path": "vision/dataset/VisDrone",
    "train": "images/train",
    "val": "images/val",
    "nc": 1,                    # Single class
    "names": ["drone"],         # Class names
    "format": "YOLO",           # Annotation format
    "image_extensions": [".jpg", ".png"],
    "annotation_format": "<class_id> <x_center> <y_center> <width> <height>"
}

# ==============================================================================
# ENVIRONMENT VARIABLES (.env)
# ==============================================================================

ENV_VARIABLES = {
    # SMTP Configuration
    "SMTP_SERVER": "smtp.gmail.com",
    "SMTP_PORT": "587",
    "SENDER_EMAIL": "your_email@gmail.com",
    "SENDER_PASSWORD": "your_app_password",  # Gmail App Password (16 chars)
    "RECIPIENT_EMAIL": "alert@example.com",
    
    # Flask Configuration (optional)
    "FLASK_ENV": "development",
    "FLASK_DEBUG": "True"
}

# ==============================================================================
# THREAT RESPONSE PIPELINE
# ==============================================================================

THREAT_RESPONSE_PIPELINE = {
    # When threat is confirmed (MEDIUM or HIGH):
    
    "Phase 1": {
        "action": "Activate simulated jammer",
        "module": "backend.jammer_sim",
        "function": "activate_jammer()",
        "duration": "~2-3 seconds simulation"
    },
    
    "Phase 2": {
        "action": "Send email alert",
        "module": "backend.email_alert",
        "function": "send_alert(detection_data)",
        "timeout": "5 seconds"
    },
    
    "Phase 3": {
        "action": "Log incident",
        "module": "backend.app",
        "function": "threat_log.append(entry)",
        "retention": "In-memory (session duration)"
    }
}

# ==============================================================================
# PERFORMANCE TUNING PARAMETERS
# ==============================================================================

PERFORMANCE_TUNING = {
    # For faster detection (lower accuracy)
    "fast_mode": {
        "imgsz": 416,           # Smaller image size
        "batch_size": 8,
        "epochs": 50
    },
    
    # For better accuracy (slower detection)
    "accuracy_mode": {
        "imgsz": 1280,          # Larger image size
        "batch_size": 32,
        "epochs": 200
    },
    
    # For CPU-only systems
    "cpu_mode": {
        "device": "cpu",
        "batch_size": 8,        # Smaller batches
        "imgsz": 416,
        "half": False           # No FP16
    },
    
    # For GPU systems
    "gpu_mode": {
        "device": 0,
        "batch_size": 32,
        "imgsz": 640,
        "half": True            # Use FP16 if available
    }
}

# ==============================================================================
# LOGGING CONFIGURATION
# ==============================================================================

LOGGING_CONFIG = {
    "level": "INFO",
    "format": "[%(asctime)s] [%(levelname)s] %(message)s",
    "modules": {
        "vision.detect_live": "INFO",
        "vision.train_yolo": "INFO",
        "logic.threat_engine": "INFO",
        "backend.app": "INFO",
        "backend.jammer_sim": "INFO",
        "backend.email_alert": "INFO"
    }
}

# ==============================================================================
# API RESPONSE CODES
# ==============================================================================

API_RESPONSES = {
    "200": "OK - Request successful",
    "400": "Bad Request - Invalid payload",
    "404": "Not Found - Endpoint doesn't exist",
    "500": "Internal Server Error - Server error",
}

THREAT_RESPONSE_CODES = {
    "success": 200,
    "bad_request": 400,
    "not_found": 404,
    "server_error": 500
}

# ==============================================================================
# SECURITY SETTINGS
# ==============================================================================

SECURITY_SETTINGS = {
    "api_authentication": False,  # Production: Enable JWT
    "https_enabled": False,       # Production: Enable HTTPS
    "rate_limiting": False,       # Production: Enable rate limiting
    "cors_enabled": False,        # Production: Configure CORS
    "input_validation": True,     # Always validate inputs
    "logging_enabled": True,      # Always log for audit trail
}

# ==============================================================================
# FILE PATHS
# ==============================================================================

FILE_PATHS = {
    "project_root": "c:/Users/Aadya/OneDrive/Desktop/AeroGuardAI",
    "vision_module": "vision/",
    "logic_module": "logic/",
    "backend_module": "backend/",
    "dataset": "vision/dataset/VisDrone/",
    "trained_weights": "runs/detect/train/weights/best.pt",
    "config_yaml": "vision/visdrone.yaml",
    "env_template": ".env.example",
    "env_config": ".env",
    "requirements": "requirements.txt",
    "readme": "README.md",
    "quickstart": "QUICKSTART.md",
    "setup_guide": "SETUP_GUIDE.md",
}

# ==============================================================================
# SYSTEM REQUIREMENTS
# ==============================================================================

SYSTEM_REQUIREMENTS = {
    "python_min_version": "3.8",
    "python_recommended": "3.10+",
    "os": ["Windows 10", "Windows 11"],
    "shell": "PowerShell",
    
    "minimum_specs": {
        "cpu": "Intel i5 or equivalent",
        "ram": "8 GB",
        "storage": "2 GB",
        "gpu": "Optional"
    },
    
    "recommended_specs": {
        "cpu": "Intel i7 or better",
        "ram": "16 GB",
        "storage": "4 GB SSD",
        "gpu": "NVIDIA (CUDA 11.8+)"
    }
}

# ==============================================================================
# TESTING CHECKLIST
# ==============================================================================

TESTING_CHECKLIST = {
    "1_imports": [
        "Run: python verify_imports.py",
        "Expected: All imports verified successfully"
    ],
    
    "2_jammer": [
        "Run: python backend/jammer_sim.py",
        "Expected: Jammer simulation output with status messages"
    ],
    
    "3_email": [
        "Run: python backend/email_alert.py",
        "Expected: Email sent confirmation (or credential warning)"
    ],
    
    "4_api_health": [
        "Start: python backend/app.py",
        "Test: curl http://localhost:5000/health",
        "Expected: JSON response with 'operational' status"
    ],
    
    "5_live_detection": [
        "Start server: python backend/app.py",
        "Run: python vision/detect_live.py",
        "Expected: Live webcam feed with detection boxes"
    ]
}

# ==============================================================================
# QUICK REFERENCE
# ==============================================================================

QUICK_REFERENCE = """
START BACKEND:
    python backend/app.py

RUN LIVE DETECTION:
    python vision/detect_live.py

TRAIN MODEL:
    python vision/train_yolo.py

VERIFY INSTALLATION:
    python verify_imports.py

TEST API:
    curl http://localhost:5000/health

MAIN THREAT THRESHOLD:
    Confidence >= 0.75 → Evaluation
    Confidence >= 0.85 → Activate countermeasures

EMAIL SETUP:
    1. Copy .env.example to .env
    2. Set SENDER_EMAIL, SENDER_PASSWORD, RECIPIENT_EMAIL
    3. Use Gmail App Password (not regular password)

KEY FILES:
    vision/detect_live.py       - Live detection
    logic/threat_engine.py      - Threat evaluation
    backend/app.py              - REST API
    backend/jammer_sim.py       - Jammer simulation
    backend/email_alert.py      - Email notifications
"""

if __name__ == "__main__":
    print(QUICK_REFERENCE)
