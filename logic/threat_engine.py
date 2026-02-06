"""
Threat Evaluation Engine for AeroGuard AI
Analyzes detection confidence and other factors to classify threat level
Triggers Flask API endpoint for confirmed threats
Implements SEE-THINK-ACT decision pipeline
"""

import sys
from pathlib import Path
from datetime import datetime
import requests
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] [%(levelname)s] %(message)s'
)
logger = logging.getLogger(__name__)

# Configuration
CONFIDENCE_THRESHOLD = 0.75
HIGH_THREAT_CONFIDENCE = 0.90
MEDIUM_THREAT_CONFIDENCE = 0.80

# Flask API endpoint
FLASK_API_URL = "http://localhost:5000/trigger"
API_TIMEOUT = 5  # seconds


class ThreatEvaluator:
    """
    Evaluates detection data and classifies threat level
    Implements threat classification logic
    """
    
    def __init__(self, 
                 low_threshold=CONFIDENCE_THRESHOLD,
                 medium_threshold=MEDIUM_THREAT_CONFIDENCE,
                 high_threshold=HIGH_THREAT_CONFIDENCE):
        """
        Initialize threat evaluator with confidence thresholds
        
        Args:
            low_threshold (float): Confidence above which threat is confirmed
            medium_threshold (float): Confidence for MEDIUM threat classification
            high_threshold (float): Confidence for HIGH threat classification
        """
        self.low_threshold = low_threshold
        self.medium_threshold = medium_threshold
        self.high_threshold = high_threshold
    
    def classify_threat(self, confidence: float) -> str:
        """
        Classify threat level based on detection confidence
        
        Args:
            confidence (float): Detection confidence (0-1)
        
        Returns:
            str: Threat level - "LOW", "MEDIUM", or "HIGH"
        """
        if confidence >= self.high_threshold:
            return "HIGH"
        elif confidence >= self.medium_threshold:
            return "MEDIUM"
        elif confidence >= self.low_threshold:
            return "LOW"
        else:
            return "NONE"
    
    def evaluate_detection(self, detection_data: dict) -> dict:
        """
        Comprehensive threat evaluation from detection data
        
        Args:
            detection_data (dict): Detection information including:
                - confidence: float
                - class_name: str
                - bbox: list [x1, y1, x2, y2]
                - timestamp: str (ISO format)
        
        Returns:
            dict: Threat evaluation result with threat_level and action
        """
        confidence = detection_data.get("confidence", 0)
        class_name = detection_data.get("class_name", "unknown")
        bbox = detection_data.get("bbox", [0, 0, 0, 0])
        timestamp = detection_data.get("timestamp", datetime.now().isoformat())
        
        # Classify threat
        threat_level = self.classify_threat(confidence)
        
        # Determine action
        action = "MONITOR"  # Default action
        api_triggered = False
        
        if threat_level == "HIGH":
            action = "ACTIVATE_COUNTERMEASURE"
            api_triggered = True
        elif threat_level == "MEDIUM":
            action = "ESCALATE_ALERT"
            api_triggered = True
        elif threat_level == "LOW":
            action = "LOG_DETECTION"
        
        result = {
            "threat_level": threat_level,
            "confidence": confidence,
            "class_name": class_name,
            "bbox": bbox,
            "timestamp": timestamp,
            "action": action,
            "api_triggered": api_triggered
        }
        
        return result


# Global threat evaluator instance
threat_evaluator = ThreatEvaluator(
    low_threshold=CONFIDENCE_THRESHOLD,
    medium_threshold=MEDIUM_THREAT_CONFIDENCE,
    high_threshold=HIGH_THREAT_CONFIDENCE
)


def trigger_flask_api(detection_data: dict) -> bool:
    """
    Trigger Flask API endpoint with detection and threat data
    
    Args:
        detection_data (dict): Detection information
    
    Returns:
        bool: True if API call successful, False otherwise
    """
    try:
        payload = {
            "threat_detected": True,
            "detection": detection_data,
            "timestamp": datetime.now().isoformat()
        }
        
        logger.info(f"[API] Sending threat trigger to {FLASK_API_URL}")
        
        response = requests.post(
            FLASK_API_URL,
            json=payload,
            timeout=API_TIMEOUT
        )
        
        if response.status_code == 200:
            logger.info(f"[API] Successfully triggered: {response.json()}")
            return True
        else:
            logger.warning(f"[API] Unexpected status code: {response.status_code}")
            return False
    
    except requests.exceptions.ConnectionError:
        logger.error(f"[API] Connection failed - Flask server not running")
        return False
    except requests.exceptions.Timeout:
        logger.error(f"[API] Request timeout after {API_TIMEOUT}s")
        return False
    except Exception as e:
        logger.error(f"[API] Error: {str(e)}")
        return False


def evaluate_threat(detection_data: dict) -> str:
    """
    Main threat evaluation function
    Implements SEE-THINK-ACT pipeline:
    - SEE: Detection data received
    - THINK: Threat evaluation
    - ACT: Trigger countermeasures if necessary
    
    Args:
        detection_data (dict): Detection data from vision module
    
    Returns:
        str: Threat level classification
    """
    
    logger.info(f"[THREAT-ENGINE] Evaluating detection...")
    
    # THINK: Evaluate threat
    evaluation = threat_evaluator.evaluate_detection(detection_data)
    
    threat_level = evaluation["threat_level"]
    action = evaluation["action"]
    api_triggered = evaluation["api_triggered"]
    
    logger.info(f"[THREAT-ENGINE] Threat level: {threat_level}")
    logger.info(f"[THREAT-ENGINE] Action: {action}")
    
    # ACT: Trigger API if threat confirmed
    if api_triggered:
        logger.info(f"[THREAT-ENGINE] INITIATING COUNTERMEASURE SEQUENCE...")
        success = trigger_flask_api(detection_data)
        if success:
            logger.info(f"[THREAT-ENGINE] Countermeasure triggered successfully")
        else:
            logger.warning(f"[THREAT-ENGINE] Countermeasure trigger failed")
    else:
        logger.info(f"[THREAT-ENGINE] No countermeasure action required")
    
    return threat_level