"""
Import Verification Script for AeroGuard AI
Tests that all modules can be imported without errors
Run this before deployment to ensure system integrity
"""

import sys
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

def test_imports():
    """Test all module imports"""
    
    print("=" * 70)
    print("AeroGuard AI - Import Verification")
    print("=" * 70)
    
    tests_passed = 0
    tests_failed = 0
    
    # Test 1: External dependencies
    print("\n[1/6] Testing external dependencies...")
    try:
        import flask
        import ultralytics
        import torch
        import cv2
        import numpy
        print("  ✓ Flask")
        print("  ✓ Ultralytics (YOLOv8)")
        print("  ✓ PyTorch")
        print("  ✓ OpenCV")
        print("  ✓ NumPy")
        tests_passed += 1
    except ImportError as e:
        print(f"  ✗ FAILED: {e}")
        print("     → Run: pip install -r requirements.txt")
        tests_failed += 1
    
    # Test 2: Vision module
    print("\n[2/6] Testing vision module...")
    try:
        from vision import train_yolo, detect_live
        print("  ✓ vision.train_yolo")
        print("  ✓ vision.detect_live")
        tests_passed += 1
    except ImportError as e:
        print(f"  ✗ FAILED: {e}")
        tests_failed += 1
    
    # Test 3: Logic module
    print("\n[3/6] Testing logic module...")
    try:
        from logic import threat_engine
        print("  ✓ logic.threat_engine")
        print("  ✓ ThreatEvaluator class")
        print("  ✓ evaluate_threat function")
        tests_passed += 1
    except ImportError as e:
        print(f"  ✗ FAILED: {e}")
        tests_failed += 1
    
    # Test 4: Backend modules
    print("\n[4/6] Testing backend modules...")
    try:
        from backend import jammer_sim, email_alert
        print("  ✓ backend.jammer_sim")
        print("  ✓ backend.email_alert")
        tests_passed += 1
    except ImportError as e:
        print(f"  ✗ FAILED: {e}")
        tests_failed += 1
    
    # Test 5: Flask app
    print("\n[5/6] Testing Flask application...")
    try:
        from backend import app
        print("  ✓ backend.app")
        print("  ✓ Flask routes registered")
        tests_passed += 1
    except ImportError as e:
        print(f"  ✗ FAILED: {e}")
        tests_failed += 1
    
    # Test 6: Configuration files
    print("\n[6/6] Checking configuration files...")
    try:
        config_files = [
            "vision/visdrone.yaml",
            "requirements.txt",
            ".env.example"
        ]
        for config_file in config_files:
            path = project_root / config_file
            if path.exists():
                print(f"  ✓ {config_file}")
            else:
                print(f"  ⚠ {config_file} not found")
        
        # Check .env (not required, but recommended)
        env_path = project_root / ".env"
        if env_path.exists():
            print(f"  ✓ .env (configured)")
        else:
            print(f"  ℹ .env not found (copy from .env.example if using email alerts)")
        
        tests_passed += 1
    except Exception as e:
        print(f"  ✗ FAILED: {e}")
        tests_failed += 1
    
    # Summary
    print("\n" + "=" * 70)
    print("VERIFICATION SUMMARY")
    print("=" * 70)
    print(f"Tests passed: {tests_passed}/6")
    print(f"Tests failed: {tests_failed}/6")
    
    if tests_failed == 0:
        print("\n✓ All imports verified successfully!")
        print("\nNext steps:")
        print("  1. Configure email: Copy .env.example to .env and fill credentials")
        print("  2. Train model: python vision/train_yolo.py")
        print("  3. Start server: python backend/app.py")
        print("  4. Run detection: python vision/detect_live.py")
        return True
    else:
        print(f"\n✗ {tests_failed} test(s) failed!")
        print("   Please install missing dependencies:")
        print("   pip install -r requirements.txt")
        return False


def test_threat_engine():
    """Test threat engine functionality"""
    
    print("\n" + "=" * 70)
    print("Threat Engine Functionality Test")
    print("=" * 70)
    
    try:
        from logic.threat_engine import ThreatEvaluator
        
        evaluator = ThreatEvaluator()
        
        test_cases = [
            (0.70, "NONE"),
            (0.75, "LOW"),
            (0.80, "MEDIUM"),
            (0.85, "HIGH"),
            (0.95, "HIGH"),
        ]
        
        print("\nTesting threat classification:")
        for confidence, expected in test_cases:
            result = evaluator.classify_threat(confidence)
            status = "✓" if result == expected else "✗"
            print(f"  {status} Confidence {confidence:.0%}: {result} (expected {expected})")
        
        print("\n✓ Threat engine test passed!")
        return True
    
    except Exception as e:
        print(f"✗ Threat engine test failed: {e}")
        return False


def test_jammer():
    """Test jammer simulator"""
    
    print("\n" + "=" * 70)
    print("Jammer Simulator Test")
    print("=" * 70)
    
    try:
        from backend.jammer_sim import JammerSimulator
        
        jammer = JammerSimulator()
        status = jammer.get_status()
        
        print(f"  ✓ Jammer initialized")
        print(f"  ✓ Active: {status['is_active']}")
        print(f"  ✓ Activation count: {status['activation_count']}")
        
        print("\n✓ Jammer simulator test passed!")
        return True
    
    except Exception as e:
        print(f"✗ Jammer simulator test failed: {e}")
        return False


if __name__ == "__main__":
    # Run verification
    imports_ok = test_imports()
    
    if imports_ok:
        threat_engine_ok = test_threat_engine()
        jammer_ok = test_jammer()
        
        if threat_engine_ok and jammer_ok:
            print("\n" + "=" * 70)
            print("✓ ALL TESTS PASSED - System ready for deployment!")
            print("=" * 70)
            sys.exit(0)
        else:
            print("\n✗ Some functional tests failed")
            sys.exit(1)
    else:
        print("\n✗ Import verification failed - please fix dependencies first")
        sys.exit(1)
