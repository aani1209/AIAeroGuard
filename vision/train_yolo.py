"""
YOLOv8 Training Module for AeroGuard AI
Trains YOLOv8n model on VisDrone dataset (single-class: drone detection)
Saves best weights to runs/detect/train/weights/best.pt
FAST CPU-compatible training script
"""

import os
import shutil
from pathlib import Path

# Suppress warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
os.environ['PYTHONWARNINGS'] = 'ignore'

from ultralytics import YOLO


def train_yolo_model():
    """
    Train YOLOv8n model on VisDrone dataset - FAST VERSION
    Uses minimal settings for CPU training to complete quickly
    """
    
    # Get project root directory
    project_root = Path(__file__).parent.parent
    
    # Clean up any previous conflicting runs
    old_runs_path = project_root / "runs" / "detect" / "runs"
    if old_runs_path.exists():
        print(f"[CLEANUP] Removing old nested runs directory: {old_runs_path}")
        try:
            shutil.rmtree(old_runs_path)
        except:
            pass
    
    # Path to dataset config
    dataset_config = project_root / "vision" / "visdrone.yaml"
    
    print(f"[TRAINING] Starting YOLOv8n training (FAST MODE)...")
    print(f"[CONFIG] Dataset config: {dataset_config}")
    
    # Load YOLOv8n model (nano version for fastest training)
    print("[MODEL] Loading YOLOv8n model...")
    model = YOLO("yolov8n.pt")
    
    # Train with minimal settings optimized for CPU
    print("[TRAINING] Starting training process (this may take a while on CPU)...")
    try:
        results = model.train(
            data=str(dataset_config),
            epochs=3,  # Reduced for faster training
            imgsz=320,  # Reduced size for speed
            device="cpu",  # CPU only
            patience=2,  # Early stopping
            batch=4,  # Small batch
            workers=0,  # No multiprocessing on CPU
            save=True,
            project=str(project_root / "runs" / "detect"),
            name="train",
            exist_ok=True,
            verbose=False,  # Less verbose output
            pretrained=True,
            optimizer="SGD",
            seed=42,
            augment=False,  # Disable augmentation for speed
            rect=False,
            close_mosaic=1,
            cache="disk",  # Use disk cache
        )
        
        print(f"\n[INFO] Training completed!")
        print(f"[RESULTS] Results path: {results.save_dir}")
    except KeyboardInterrupt:
        print("\n[WARNING] Training interrupted by user")
    except Exception as e:
        print(f"\n[ERROR] Training failed: {e}")
    
    # Verify best weights were saved
    best_weights = project_root / "runs" / "detect" / "train" / "weights" / "best.pt"
    last_weights = project_root / "runs" / "detect" / "train" / "weights" / "last.pt"
    
    if best_weights.exists():
        print(f"\n[SUCCESS] Training complete!")
        print(f"[WEIGHTS] Best model saved: {best_weights}")
        return str(best_weights)
    elif last_weights.exists():
        print(f"\n[SUCCESS] Training checkpoint saved!")
        print(f"[WEIGHTS] Last model saved: {last_weights}")
        return str(last_weights)
    else:
        print(f"\n[ERROR] No weights file found")
        print(f"[DEBUG] Contents of runs/detect/train:")
        train_dir = project_root / "runs" / "detect" / "train"
        if train_dir.exists():
            for item in sorted(train_dir.rglob('*')):
                if item.is_file():
                    print(f"  {item.relative_to(project_root)}")
        return None


if __name__ == "__main__":
    train_yolo_model()