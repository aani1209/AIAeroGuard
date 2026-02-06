#!/usr/bin/env python3
"""
Direct email alert test script
Tests email sending independently of the API
"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from backend.email_alert import send_alert
import logging

# Setup logging to see all details
logging.basicConfig(
    level=logging.DEBUG,
    format='[%(asctime)s] [%(levelname)s] %(message)s'
)

print("\n" + "="*70)
print("DIRECT EMAIL ALERT TEST")
print("="*70 + "\n")

# Test with sample detection data
test_detection = {
    "class_name": "drone",
    "confidence": 0.95,
    "threat_level": "CRITICAL",
    "bbox": [100, 100, 500, 400]
}

print("📧 Testing email alert...")
print(f"   Detection: {test_detection}\n")

result = send_alert(test_detection)

print("\n" + "="*70)
if result:
    print("✓ EMAIL TEST PASSED - Alert was sent!")
else:
    print("✗ EMAIL TEST FAILED - Check logs above for details")
print("="*70 + "\n")

sys.exit(0 if result else 1)
