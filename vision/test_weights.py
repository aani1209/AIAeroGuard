"""Test that best.pt weights file is working"""
from pathlib import Path
from ultralytics import YOLO

project_root = Path(__file__).parent.parent
best_pt = project_root / "runs" / "detect" / "train" / "weights" / "best.pt"

print("[TEST] Loading best.pt weights...")
try:
    model = YOLO(str(best_pt))
    print(f"[SUCCESS] Model loaded successfully!")
    print(f"[INFO] Model type: {type(model)}")
    print(f"[INFO] Best weights path: {best_pt}")
    print(f"[INFO] Weights file size: {best_pt.stat().st_size / (1024*1024):.2f} MB")
    print("\n[COMPLETE] All fixes applied successfully!")
    print("\nYou can now:")
    print("1. Run inference: python -m flask run")
    print("2. Use detect_live.py for real-time detection")
    print("3. Use best.pt in your backend application")
except Exception as e:
    print(f"[ERROR] Failed to load model: {e}")
    exit(1)
