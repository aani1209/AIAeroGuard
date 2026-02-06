#!/usr/bin/env python
"""
Create a minimal stub best.pt weights file for testing
This allows the system to work without waiting hours for CPU training
"""

from pathlib import Path
from ultralytics import YOLO

# Create a minimal trained model
model = YOLO("yolov8n.pt")

# Save the pretrained model as best.pt in the expected location
project_root = Path(__file__).parent.parent
weights_dir = project_root / "runs" / "detect" / "train" / "weights"
weights_dir.mkdir(parents=True, exist_ok=True)

best_pt = weights_dir / "best.pt"
last_pt = weights_dir / "last.pt"

# Save the model
model.save(str(best_pt))
model.save(str(last_pt))

print(f"[SUCCESS] Created stub weights at:")
print(f"  {best_pt}")
print(f"  {last_pt}")
print("\nNote: These are pretrained YOLOv8n weights, not trained on your dataset.")
print("For production, run full training with GPU acceleration.")
