"""
Email Alert Module for AeroGuard AI
Sends email notifications when threats are confirmed
Uses SMTP with credentials from .env file
"""

import smtplib
import logging
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    print("[WARNING] python-dotenv not installed. Email credentials must be set via environment variables.")

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] [EMAIL] %(message)s'
)
logger = logging.getLogger(__name__)

# Configuration - Load from environment variables
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SENDER_EMAIL = os.getenv("SENDER_EMAIL", "your_email@gmail.com")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD", "your_app_password")
RECIPIENT_EMAIL = os.getenv("RECIPIENT_EMAIL", "alert@example.com")


class EmailAlertService:
    """
    Handles email alert notifications for threat detections
    """
    
    def __init__(self, 
                 smtp_server=SMTP_SERVER,
                 smtp_port=SMTP_PORT,
                 sender_email=SENDER_EMAIL,
                 sender_password=SENDER_PASSWORD,
                 recipient_email=RECIPIENT_EMAIL):
        """
        Initialize email alert service
        
        Args:
            smtp_server (str): SMTP server address
            smtp_port (int): SMTP server port
            sender_email (str): Sender email address
            sender_password (str): Sender email password or app token
            recipient_email (str): Recipient email address
        """
        self.smtp_server = smtp_server
        self.smtp_port = smtp_port
        self.sender_email = sender_email
        self.sender_password = sender_password
        self.recipient_email = recipient_email
        self.alerts_sent = 0
    
    def _validate_credentials(self) -> bool:
        """
        Validate that email credentials are properly configured
        
        Returns:
            bool: True if credentials appear valid
        """
        if not self.sender_email or self.sender_email == "your_email@gmail.com":
            logger.warning("Sender email not configured. Set SENDER_EMAIL in .env file.")
            return False
        
        if not self.sender_password or self.sender_password == "your_app_password":
            logger.warning("Sender password not configured. Set SENDER_PASSWORD in .env file.")
            return False
        
        if not self.recipient_email or self.recipient_email == "alert@example.com":
            logger.warning("Recipient email not configured. Set RECIPIENT_EMAIL in .env file.")
            return False
        
        return True
    
    def send_alert(self, detection_data: dict = None) -> bool:
        """
        Send email alert for threat detection
        
        Args:
            detection_data (dict): Optional detection information to include
        
        Returns:
            bool: True if email sent successfully
        """
        
        logger.info("Preparing email alert...")
        logger.info(f"[DEBUG] Sender: {self.sender_email}")
        logger.info(f"[DEBUG] Recipient: {self.recipient_email}")
        logger.info(f"[DEBUG] SMTP: {self.smtp_server}:{self.smtp_port}")
        
        # Validate credentials
        if not self._validate_credentials():
            logger.error("Email credentials not properly configured")
            logger.error(f"[DEBUG] SENDER_EMAIL={self.sender_email}")
            logger.error(f"[DEBUG] SENDER_PASSWORD={'*'*len(self.sender_password) if self.sender_password else 'EMPTY'}")
            logger.error(f"[DEBUG] RECIPIENT_EMAIL={self.recipient_email}")
            return False
        
        try:
            # Create email message
            message = MIMEMultipart("alternative")
            message["Subject"] = "🚨 UNAUTHORIZED DRONE DETECTED - AeroGuard AI"
            message["From"] = self.sender_email
            message["To"] = self.recipient_email
            
            # Create email body
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
            # Plain text version
            text_body = f"""
UNAUTHORIZED DRONE DETECTED
===========================

AeroGuard AI Threat Alert
Timestamp: {timestamp}

THREAT CLASSIFICATION: CONFIRMED
Status: Countermeasure activated

Detection Details:
"""
            
            if detection_data:
                text_body += f"""
- Class: {detection_data.get('class_name', 'Unknown')}
- Confidence: {detection_data.get('confidence', 0):.2%}
- Threat Level: {detection_data.get('threat_level', 'UNKNOWN')}
- Location (BBox): {detection_data.get('bbox', 'N/A')}
"""
            
            text_body += """
ACTION TAKEN:
✓ Anti-drone jammer activated
✓ Alert notifications sent
✓ Incident logged

For more information, visit: https://github.com/aeroguard-ai

---
This is an automated alert from AeroGuard AI
"""
            
            # Prepare HTML content with proper escaping
            class_name = detection_data.get('class_name', 'Unknown') if detection_data else 'N/A'
            confidence = detection_data.get('confidence', 0) if detection_data else 0
            threat_level = detection_data.get('threat_level', 'UNKNOWN') if detection_data else 'N/A'
            bbox = str(detection_data.get('bbox', 'N/A')) if detection_data else 'N/A'
            
            confidence_str = f"{confidence:.2%}" if isinstance(confidence, (int, float)) else 'N/A'
            
            # HTML version (more formatted)
            html_body = f"""
<html>
  <body style="font-family: Arial, sans-serif; color: #333;">
    <div style="border: 3px solid #d32f2f; padding: 20px; border-radius: 8px; background-color: #ffebee;">
      <h2 style="color: #d32f2f; text-align: center;">
        🚨 UNAUTHORIZED DRONE DETECTED
      </h2>
      <hr style="border: 1px solid #d32f2f;">
      
      <h3>AeroGuard AI Threat Alert</h3>
      <p><strong>Timestamp:</strong> {timestamp}</p>
      <p><strong>Status:</strong> <span style="color: #d32f2f; font-weight: bold;">THREAT CONFIRMED</span></p>
      
      <h3>Detection Details:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">Class:</td>
          <td style="padding: 8px;">{class_name}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">Confidence:</td>
          <td style="padding: 8px;">{confidence_str}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">Threat Level:</td>
          <td style="padding: 8px;">{threat_level}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">Location (BBox):</td>
          <td style="padding: 8px;">{bbox}</td>
        </tr>
      </table>
      
      <h3 style="color: #2e7d32;">Actions Taken:</h3>
      <ul style="color: #2e7d32;">
        <li>✓ Anti-drone jammer activated</li>
        <li>✓ Alert notifications sent</li>
        <li>✓ Incident logged in system</li>
      </ul>
      
      <hr>
      <p style="color: #666; font-size: 12px;">
        This is an automated alert from <strong>AeroGuard AI</strong><br>
        For more information: https://github.com/aeroguard-ai
      </p>
    </div>
  </body>
</html>
"""
            
            # Attach both versions
            message.attach(MIMEText(text_body, "plain"))
            message.attach(MIMEText(html_body, "html"))
            
            # Send email
            logger.info(f"Connecting to SMTP server {self.smtp_server}:{self.smtp_port}...")
            
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()  # Secure connection
                logger.info("TLS connection established")
                
                logger.info(f"Authenticating as {self.sender_email}...")
                server.login(self.sender_email, self.sender_password)
                logger.info(f"✓ Authentication successful")
                
                logger.info(f"Sending alert to {self.recipient_email}...")
                server.send_message(message)
                logger.info(f"✓ Message sent to SMTP server")
            
            self.alerts_sent += 1
            logger.info(f"✓ Email alert sent successfully! (Total sent: {self.alerts_sent})")
            return True
        
        except smtplib.SMTPAuthenticationError as e:
            logger.error(f"❌ SMTP Authentication failed - check email credentials")
            logger.error(f"   Error details: {str(e)}")
            return False
        
        except smtplib.SMTPException as e:
            logger.error(f"❌ SMTP error: {str(e)}")
            logger.error(f"   Error type: {type(e).__name__}")
            return False
        
        except Exception as e:
            logger.error(f"❌ Unexpected error sending email: {str(e)}")
            logger.error(f"   Error type: {type(e).__name__}")
            import traceback
            logger.error(f"   Traceback: {traceback.format_exc()}")
            return False
    
    def get_alert_statistics(self) -> dict:
        """Get email alert statistics"""
        return {
            "total_alerts_sent": self.alerts_sent,
            "recipient": self.recipient_email
        }


# Global email alert service instance
email_service = EmailAlertService(
    smtp_server=SMTP_SERVER,
    smtp_port=SMTP_PORT,
    sender_email=SENDER_EMAIL,
    sender_password=SENDER_PASSWORD,
    recipient_email=RECIPIENT_EMAIL
)


def send_alert(detection_data: dict = None) -> bool:
    """
    Public function to send email alert
    Called by Flask API when threat is confirmed
    
    Args:
        detection_data (dict): Optional detection information
    
    Returns:
        bool: True if successful
    """
    logger.info("Alert triggered - sending notification email...")
    return email_service.send_alert(detection_data)


def get_alert_stats() -> dict:
    """Get email alert statistics"""
    return email_service.get_alert_statistics()


if __name__ == "__main__":
    # Test email alert (requires valid credentials in .env)
    logger.info("Testing email alert service...")
    test_data = {
        "class_name": "drone",
        "confidence": 0.92,
        "threat_level": "HIGH",
        "bbox": [150, 100, 450, 400]
    }
    send_alert(test_data)