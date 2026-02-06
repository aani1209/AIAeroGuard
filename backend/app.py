"""
Flask Backend API for AeroGuard AI
Provides REST endpoints for threat handling and countermeasure activation
Implements ACT phase of SEE-THINK-ACT pipeline
"""

import sys
from pathlib import Path
import logging
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

# Add parent directory to path for relative imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from jammer_sim import activate_jammer, deactivate_jammer, get_jammer_status
from email_alert import send_alert, get_alert_stats

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] [FLASK] %(message)s'
)
logger = logging.getLogger(__name__)

# Setup paths for frontend integration
PROJECT_ROOT = Path(__file__).parent.parent
FRONTEND_BUILD = PROJECT_ROOT / "frontend" / "dist"

# Create Flask app with static files serving
app = Flask(
    __name__,
    static_folder=str(FRONTEND_BUILD),
    static_url_path=""
)

# Enable CORS for API endpoints
CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config['JSON_SORT_KEYS'] = False

# Global state for threat tracking
threat_log = []


# ============================================================================
# FRONTEND ROUTES (Serve React app)
# ============================================================================

@app.route('/')
def serve_index():
    """Serve index.html for SPA"""
    return send_from_directory(FRONTEND_BUILD, 'index.html')


@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files (JS, CSS, images)"""
    return send_from_directory(FRONTEND_BUILD, filename)


# Catch-all for SPA routing - serve index.html for all non-API routes
@app.route('/<path:path>')
def serve_spa(path):
    """Serve frontend for all non-API routes (SPA routing)"""
    if path.startswith('api/'):
        return jsonify({"status": "error", "message": "Endpoint not found"}), 404
    
    # Serve index.html for all other routes (React Router will handle routing)
    frontend_index = FRONTEND_BUILD / 'index.html'
    if frontend_index.exists():
        return send_from_directory(FRONTEND_BUILD, 'index.html')
    else:
        return jsonify({
            "status": "error",
            "message": "Frontend not built. Run: cd frontend && npm run build"
        }), 404


# ============================================================================
# API ENDPOINTS (Backend logic)
# ============================================================================



@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Health check endpoint
    Verifies API is running
    
    Returns:
        JSON: Status information
    """
    return jsonify({
        "status": "operational",
        "service": "AeroGuard AI Backend",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }), 200


@app.route('/api/trigger', methods=['POST'])
def trigger_response():
    """
    Main threat response endpoint
    Activates countermeasures when threat is confirmed
    
    Expected JSON payload:
    {
        "threat_detected": bool,
        "detection": {
            "class_name": "drone",
            "confidence": float,
            "bbox": [x1, y1, x2, y2],
            "timestamp": str
        }
    }
    
    Returns:
        JSON: Response status and details
    """
    
    logger.info("="*70)
    logger.info("THREAT RESPONSE ENDPOINT TRIGGERED")
    logger.info("="*70)
    
    try:
        # Parse request payload
        data = request.json
        
        if not data:
            logger.warning("Empty request payload")
            return jsonify({
                "status": "error",
                "message": "Empty payload"
            }), 400
        
        threat_detected = data.get("threat_detected", False)
        detection = data.get("detection", {})
        timestamp = datetime.now().isoformat()
        
        logger.info(f"Threat detected: {threat_detected}")
        logger.info(f"Detection class: {detection.get('class_name', 'Unknown')}")
        logger.info(f"Confidence: {detection.get('confidence', 0):.2%}")
        
        if threat_detected:
            # Log threat
            threat_entry = {
                "timestamp": timestamp,
                "detection": detection,
                "action": "COUNTERMEASURE_ACTIVATED"
            }
            threat_log.append(threat_entry)
            
            logger.info("="*70)
            logger.info("INITIATING COUNTERMEASURE SEQUENCE")
            logger.info("="*70)
            
            # Phase 1: Activate jammer
            logger.info("[PHASE 1] Activating anti-drone jammer...")
            try:
                activate_jammer()
                logger.info("[PHASE 1] ✓ Jammer activation complete")
            except Exception as e:
                logger.error(f"[PHASE 1] ✗ Jammer activation failed: {str(e)}")
            
            # Phase 2: Send alert
            logger.info("[PHASE 2] Sending threat notification...")
            try:
                logger.info("[PHASE 2] Calling send_alert function...")
                email_sent = send_alert(detection)
                logger.info(f"[PHASE 2] send_alert returned: {email_sent}")
                if email_sent:
                    logger.info("[PHASE 2] ✓ Email alert sent")
                else:
                    logger.warning("[PHASE 2] ✗ Email alert delivery failed - check logs above for details")
            except Exception as e:
                logger.error(f"[PHASE 2] ✗ Email service error: {str(e)}")
                import traceback
                logger.error(f"   Traceback: {traceback.format_exc()}")
            
            logger.info("="*70)
            logger.info("COUNTERMEASURE SEQUENCE COMPLETE")
            logger.info("="*70)
            
            return jsonify({
                "status": "success",
                "message": "Threat response activated",
                "actions": {
                    "jammer": "ACTIVATED",
                    "email_alert": "SENT"
                },
                "threat_entry": threat_entry,
                "timestamp": timestamp
            }), 200
        
        else:
            logger.info("No threat detected - monitoring only")
            return jsonify({
                "status": "success",
                "message": "No action required",
                "timestamp": timestamp
            }), 200
    
    except Exception as e:
        logger.error(f"Error processing threat response: {str(e)}")
        return jsonify({
            "status": "error",
            "message": f"Internal server error: {str(e)}"
        }), 500


@app.route('/api/status', methods=['GET'])
def get_status():
    """
    Get system status
    Returns jammer and email service status
    
    Returns:
        JSON: System status information
    """
    try:
        jammer_status = get_jammer_status()
        email_stats = get_alert_stats()
        
        return jsonify({
            "status": "operational",
            "timestamp": datetime.now().isoformat(),
            "jammer": jammer_status,
            "email_service": email_stats,
            "threats_logged": len(threat_log)
        }), 200
    
    except Exception as e:
        logger.error(f"Error retrieving status: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


@app.route('/api/threat-log', methods=['GET'])
def get_threat_log():
    """
    Get threat detection log
    Returns all logged threats since service start
    
    Returns:
        JSON: Array of threat entries
    """
    try:
        return jsonify({
            "status": "success",
            "threat_count": len(threat_log),
            "threats": threat_log,
            "timestamp": datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        logger.error(f"Error retrieving threat log: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


@app.route('/api/threat-log', methods=['DELETE'])
def clear_threat_log():
    """
    Clear threat detection log
    Resets threat history
    
    Returns:
        JSON: Confirmation message
    """
    global threat_log
    
    try:
        count = len(threat_log)
        threat_log = []
        
        logger.info(f"Threat log cleared ({count} entries removed)")
        
        return jsonify({
            "status": "success",
            "message": f"Threat log cleared ({count} entries removed)",
            "timestamp": datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        logger.error(f"Error clearing threat log: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


@app.route('/api/jammer/deactivate', methods=['POST'])
def manual_deactivate():
    """
    Manually deactivate jammer
    For testing/override purposes
    
    Returns:
        JSON: Confirmation message
    """
    try:
        logger.info("Manual jammer deactivation requested")
        deactivate_jammer()
        
        return jsonify({
            "status": "success",
            "message": "Jammer deactivated",
            "timestamp": datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        logger.error(f"Error deactivating jammer: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        "status": "error",
        "message": "Endpoint not found"
    }), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({
        "status": "error",
        "message": "Internal server error"
    }), 500


def run_server(host='0.0.0.0', port=5000, debug=False):
    """
    Run Flask development server
    
    Args:
        host (str): Server host
        port (int): Server port
        debug (bool): Enable debug mode
    """
    logger.info("="*70)
    logger.info("AeroGuard AI Backend + Frontend Server Starting")
    logger.info("="*70)
    logger.info(f"Host: {host}")
    logger.info(f"Port: {port}")
    logger.info(f"Debug: {debug}")
    logger.info(f"Frontend: {FRONTEND_BUILD}")
    logger.info("="*70)
    
    if not FRONTEND_BUILD.exists():
        logger.warning(f"⚠️  Frontend build not found at {FRONTEND_BUILD}")
        logger.warning("Build frontend first: cd frontend && npm run build")
    
    app.run(host=host, port=port, debug=debug)


if __name__ == '__main__':
    # Run development server
    run_server(host='0.0.0.0', port=5000, debug=True)