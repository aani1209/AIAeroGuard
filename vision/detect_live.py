"""
Real-time Drone Detection Module for AeroGuard AI
Loads trained YOLOv8 model and performs live inference from webcam
Detects "drone" class with 0.75 confidence threshold
Triggers threat evaluation and Flask API on detection
"""

import os
import sys
from pathlib import Path
import cv2
import numpy as np
from ultralytics import YOLO
from datetime import datetime

# Add parent directory to path for relative imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from logic.threat_engine import evaluate_threat


# Configuration
MODEL_PATH = "runs/detect/train/weights/best.pt"
CONFIDENCE_THRESHOLD = 0.75
CLASS_NAME = "drone"


def load_model():
    """
    Load trained YOLOv8 model
    Falls back to pretrained model if best.pt not found
    """
    if os.path.exists(MODEL_PATH):
        print(f"[MODEL] Loading trained weights from {MODEL_PATH}")
        model = YOLO(MODEL_PATH)
    else:
        print(f"[MODEL] Best.pt not found at {MODEL_PATH}")
        print(f"[MODEL] Loading pretrained YOLOv8n model...")
        model = YOLO("yolov8n.pt")
    
    return model


def run_detection_pipeline(source=0, confidence_threshold=CONFIDENCE_THRESHOLD):
    """
    Run live detection from webcam or video source
    
    Args:
        source (int or str): 0 for webcam, or path to video file
        confidence_threshold (float): Minimum confidence to trigger threat evaluation
    """
    
    print(f"[DETECTION] Initializing live detection pipeline...")
    
    # Load model
    model = load_model()
    
    # Open video source (webcam = 0)
    cap = cv2.VideoCapture(source)
    
    if not cap.isOpened():
        print(f"[ERROR] Cannot open video source: {source}")
        return False
    
    print(f"[DETECTION] Pipeline started. Press 'q' to exit.")
    
    frame_count = 0
    detection_count = 0
    threat_count = 0
    
    try:
        while True:
            ret, frame = cap.read()
            
            if not ret:
                print(f"[WARNING] Failed to read frame, restarting...")
                break
            
            frame_count += 1
            
            # Run YOLOv8 inference
            results = model.predict(
                source=frame,
                conf=confidence_threshold,
                verbose=False,
                device="cpu"  # 0 for GPU, 'cpu' for CPU
            )
            
            # Process detections
            if results and len(results) > 0:
                result = results[0]
                detections = result.boxes
                
                # Draw detections and evaluate threats
                if detections is not None and len(detections) > 0:
                    detection_count += 1
                    
                    for box in detections:
                        # Extract bounding box coordinates
                        x1, y1, x2, y2 = map(int, box.xyxy[0])
                        confidence = float(box.conf[0])
                        class_id = int(box.cls[0])
                        
                        # Get class name from model
                        class_name = model.names[class_id] if class_id < len(model.names) else "unknown"
                        
                        print(f"[DETECTION] {class_name.upper()} detected")
                        print(f"  └─ Confidence: {confidence:.2%}")
                        print(f"  └─ Location: ({x1}, {y1}) → ({x2}, {y2})")
                        print(f"  └─ Timestamp: {datetime.now().isoformat()}")
                        
                        # Evaluate threat and trigger API if necessary
                        threat_data = {
                            "class_name": class_name,
                            "confidence": confidence,
                            "bbox": [x1, y1, x2, y2],
                            "timestamp": datetime.now().isoformat(),
                            "frame_id": frame_count
                        }
                        
                        threat_level = evaluate_threat(threat_data)
                        if threat_level in ["MEDIUM", "HIGH"]:
                            threat_count += 1
                            print(f"[ALERT] Threat level: {threat_level}")
                        
                        # Draw bounding box on frame
                        color = (0, 255, 0) if threat_level == "LOW" else (0, 165, 255) if threat_level == "MEDIUM" else (0, 0, 255)
                        cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                        
                        # Draw label with confidence
                        label = f"{class_name.upper()} {confidence:.2%}"
                        label_size, _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
                        cv2.rectangle(frame, (x1, y1 - label_size[1] - 5), (x1 + label_size[0], y1), color, -1)
                        cv2.putText(frame, label, (x1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
            
            # Display frame with detections
            cv2.imshow("AeroGuard AI - Live Detection", frame)
            
            # Exit on 'q' key
            if cv2.waitKey(1) & 0xFF == ord('q'):
                print(f"\n[INFO] Exiting detection pipeline...")
                break
    
    except KeyboardInterrupt:
        print(f"\n[INFO] Detection interrupted by user")
    
    finally:
        # Cleanup
        cap.release()
        cv2.destroyAllWindows()
        
        # Print statistics
        print(f"\n[STATISTICS]")
        print(f"  Total frames processed: {frame_count}")
        print(f"  Detections made: {detection_count}")
        print(f"  Threats confirmed: {threat_count}")
        
        return True


if __name__ == "__main__":
    # Run live detection from webcam
    run_detection_pipeline(source=0, confidence_threshold=CONFIDENCE_THRESHOLD)