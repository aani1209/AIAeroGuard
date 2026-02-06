"""
Convert VisDrone dataset format to YOLO format
VisDrone format: x1,y1,x2,y2,score,object_category,truncation,occlusion
YOLO format: class_id center_x center_y width height (normalized 0-1)
"""

import os
from pathlib import Path
import shutil
from PIL import Image


def convert_visdrone_to_yolo():
    """Convert VisDrone format annotations to YOLO format"""
    
    base_path = Path(__file__).parent / "dataset" / "VisDrone"
    
    # Create YOLO format directories
    yolo_path = base_path / "yolo_format"
    yolo_path.mkdir(exist_ok=True)
    
    train_images = yolo_path / "images" / "train"
    train_labels = yolo_path / "labels" / "train"
    val_images = yolo_path / "images" / "val"
    val_labels = yolo_path / "labels" / "val"
    
    for path in [train_images, train_labels, val_images, val_labels]:
        path.mkdir(parents=True, exist_ok=True)
    
    print("[CONVERTING] Starting VisDrone to YOLO format conversion...")
    
    # Convert training set
    train_seq_path = base_path / "images" / "train" / "VisDrone2019-VID-train" / "sequences"
    train_ann_path = base_path / "images" / "train" / "VisDrone2019-VID-train" / "annotations"
    
    if train_seq_path.exists() and train_ann_path.exists():
        convert_dataset_split(train_seq_path, train_ann_path, train_images, train_labels, "train")
    else:
        print(f"[WARNING] Training set not found at {train_seq_path}")
    
    # Convert validation set (DET format - different from VID)
    val_img_path = base_path / "images" / "val" / "VisDrone2019-DET-val" / "images"
    val_ann_path = base_path / "images" / "val" / "VisDrone2019-DET-val" / "annotations"
    
    if val_img_path.exists() and val_ann_path.exists():
        convert_det_dataset_split(val_img_path, val_ann_path, val_images, val_labels, "val")
    else:
        print(f"[WARNING] Validation set not found at {val_img_path}")
    
    print("[SUCCESS] Conversion completed!")
    print(f"[OUTPUT] YOLO format dataset saved to: {yolo_path}")
    
    return yolo_path


def convert_dataset_split(seq_path, ann_path, out_images, out_labels, split_name):
    """Convert a single VID dataset split (train or val)"""
    
    converted_count = 0
    skipped_count = 0
    
    # Get all sequence folders
    sequence_folders = sorted([d for d in seq_path.iterdir() if d.is_dir()])
    
    print(f"\n[{split_name.upper()}] Processing {len(sequence_folders)} VID sequences...")
    
    for seq_idx, seq_folder in enumerate(sequence_folders):
        seq_name = seq_folder.name
        ann_file = ann_path / f"{seq_name}.txt"
        
        if not ann_file.exists():
            skipped_count += 1
            continue
        
        # Read annotations
        annotations = {}
        with open(ann_file, 'r') as f:
            for line in f:
                parts = line.strip().split(',')
                if len(parts) >= 8:
                    frame_id = int(parts[0])
                    x1, y1, x2, y2 = int(parts[1]), int(parts[2]), int(parts[3]), int(parts[4])
                    obj_category = int(parts[6])
                    
                    # Only include valid objects (not ignored/others)
                    if obj_category == 0:  # Pedestrian
                        if frame_id not in annotations:
                            annotations[frame_id] = []
                        annotations[frame_id].append((x1, y1, x2, y2))
        
        # Process each image in sequence
        image_files = sorted([f for f in seq_folder.iterdir() if f.suffix.lower() in ['.jpg', '.png']])
        
        for img_idx, img_file in enumerate(image_files):
            frame_id = img_idx + 1
            
            try:
                # Copy image
                output_image = out_images / f"{seq_name}_{frame_id:06d}.jpg"
                shutil.copy2(img_file, output_image)
                
                # Get image dimensions
                with Image.open(img_file) as img:
                    img_width, img_height = img.size
                
                # Convert and save annotations in YOLO format
                output_label = out_labels / f"{seq_name}_{frame_id:06d}.txt"
                
                with open(output_label, 'w') as f:
                    if frame_id in annotations:
                        for x1, y1, x2, y2 in annotations[frame_id]:
                            # Ensure bounds are within image
                            x1 = max(0, min(x1, img_width - 1))
                            y1 = max(0, min(y1, img_height - 1))
                            x2 = max(0, min(x2, img_width - 1))
                            y2 = max(0, min(y2, img_height - 1))
                            
                            if x2 <= x1 or y2 <= y1:
                                continue
                            
                            # Convert to YOLO format (normalized center_x, center_y, width, height)
                            center_x = ((x1 + x2) / 2.0) / img_width
                            center_y = ((y1 + y2) / 2.0) / img_height
                            width = (x2 - x1) / img_width
                            height = (y2 - y1) / img_height
                            
                            # Clamp to [0, 1]
                            center_x = max(0, min(1, center_x))
                            center_y = max(0, min(1, center_y))
                            width = max(0, min(1, width))
                            height = max(0, min(1, height))
                            
                            # Class 0 = drone/object
                            f.write(f"0 {center_x:.6f} {center_y:.6f} {width:.6f} {height:.6f}\n")
                
                converted_count += 1
                
                if converted_count % 100 == 0:
                    print(f"  [{split_name}] Converted {converted_count} images...")
                    
            except Exception as e:
                print(f"[ERROR] Failed to process {img_file}: {e}")
                skipped_count += 1
    
    print(f"[{split_name.upper()}] VID - Converted: {converted_count}, Skipped: {skipped_count}")


def convert_det_dataset_split(img_path, ann_path, out_images, out_labels, split_name):
    """Convert a single DET dataset split (detection format)"""
    
    converted_count = 0
    skipped_count = 0
    
    print(f"\n[{split_name.upper()}] Processing DET format images...")
    
    # Get all image files
    image_files = sorted([f for f in img_path.iterdir() if f.suffix.lower() in ['.jpg', '.png']])
    
    print(f"[{split_name.upper()}] Found {len(image_files)} DET images...")
    
    for img_file in image_files:
        img_name = img_file.stem
        ann_file = ann_path / f"{img_name}.txt"
        
        if not ann_file.exists():
            skipped_count += 1
            continue
        
        try:
            # Copy image
            output_image = out_images / f"{img_name}.jpg"
            shutil.copy2(img_file, output_image)
            
            # Get image dimensions
            with Image.open(img_file) as img:
                img_width, img_height = img.size
            
            # Convert and save annotations in YOLO format
            output_label = out_labels / f"{img_name}.txt"
            
            with open(output_label, 'w') as f:
                with open(ann_file, 'r') as ann:
                    for line in ann:
                        parts = line.strip().split(',')
                        if len(parts) >= 4:
                            x1, y1, x2, y2 = int(parts[0]), int(parts[1]), int(parts[2]), int(parts[3])
                            obj_category = int(parts[5]) if len(parts) > 5 else 0
                            
                            # Ensure bounds are within image
                            x1 = max(0, min(x1, img_width - 1))
                            y1 = max(0, min(y1, img_height - 1))
                            x2 = max(x1 + 1, min(x2, img_width))
                            y2 = max(y1 + 1, min(y2, img_height))
                            
                            if x2 <= x1 or y2 <= y1:
                                continue
                            
                            # Convert to YOLO format (normalized center_x, center_y, width, height)
                            center_x = ((x1 + x2) / 2.0) / img_width
                            center_y = ((y1 + y2) / 2.0) / img_height
                            width = (x2 - x1) / img_width
                            height = (y2 - y1) / img_height
                            
                            # Clamp to [0, 1]
                            center_x = max(0, min(1, center_x))
                            center_y = max(0, min(1, center_y))
                            width = max(0, min(1, width))
                            height = max(0, min(1, height))
                            
                            # Class 0 = object
                            f.write(f"0 {center_x:.6f} {center_y:.6f} {width:.6f} {height:.6f}\n")
            
            converted_count += 1
            
            if converted_count % 100 == 0:
                print(f"  [{split_name}] Converted {converted_count} DET images...")
                
        except Exception as e:
            print(f"[ERROR] Failed to process {img_file}: {e}")
            skipped_count += 1
    
    print(f"[{split_name.upper()}] DET - Converted: {converted_count}, Skipped: {skipped_count}")


if __name__ == "__main__":
    convert_visdrone_to_yolo()
