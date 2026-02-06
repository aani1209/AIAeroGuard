#!/usr/bin/env python3
"""
AeroGuard AI - Environment & Configuration Validator
Checks if all systems are properly configured before running
"""

import sys
import os
from pathlib import Path
import subprocess

# Color codes for terminal output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'
BOLD = '\033[1m'

def print_header(text):
    """Print section header"""
    print(f"\n{BOLD}{BLUE}{'='*70}{RESET}")
    print(f"{BOLD}{BLUE}{text:^70}{RESET}")
    print(f"{BOLD}{BLUE}{'='*70}{RESET}\n")

def print_success(text):
    """Print success message"""
    print(f"{GREEN}✓{RESET} {text}")

def print_error(text):
    """Print error message"""
    print(f"{RED}✗{RESET} {text}")

def print_warning(text):
    """Print warning message"""
    print(f"{YELLOW}⚠{RESET} {text}")

def print_info(text):
    """Print info message"""
    print(f"{BLUE}ℹ{RESET} {text}")

def check_python_version():
    """Check Python version"""
    print_header("Python Configuration")
    
    version = sys.version_info
    if version.major >= 3 and version.minor >= 8:
        print_success(f"Python {version.major}.{version.minor}.{version.micro}")
        return True
    else:
        print_error(f"Python {version.major}.{version.minor} (requires 3.8+)")
        return False

def check_python_packages():
    """Check if required Python packages are installed"""
    print_header("Python Dependencies")
    
    required_packages = {
        'flask': 'Flask',
        'flask_cors': 'flask-cors',
        'requests': 'requests',
        'dotenv': 'python-dotenv',
        'cv2': 'opencv-python (optional)',
        'torch': 'torch',
        'ultralytics': 'ultralytics'
    }
    
    all_ok = True
    for import_name, package_name in required_packages.items():
        try:
            __import__(import_name)
            print_success(f"{package_name}")
        except ImportError:
            print_error(f"{package_name} - install with: pip install {package_name}")
            all_ok = False
    
    return all_ok

def check_env_file():
    """Check if .env file exists and is configured"""
    print_header("Environment Configuration")
    
    env_path = Path('.env')
    
    if not env_path.exists():
        print_error(".env file not found in current directory")
        return False
    
    print_success(".env file found")
    
    # Check required variables
    try:
        from dotenv import load_dotenv
        load_dotenv()
        
        required_vars = [
            ('SENDER_EMAIL', 'Email sender address'),
            ('SENDER_PASSWORD', 'Email sender password'),
            ('RECIPIENT_EMAIL', 'Email recipient address'),
            ('SMTP_SERVER', 'SMTP server address'),
            ('SMTP_PORT', 'SMTP server port'),
        ]
        
        all_ok = True
        for var_name, description in required_vars:
            value = os.getenv(var_name)
            
            if not value:
                print_error(f"{description} ({var_name}) not configured")
                all_ok = False
            elif value in ['your_email@gmail.com', 'your_app_password', 'alert@example.com']:
                print_warning(f"{description} ({var_name}) using placeholder value")
            else:
                # Hide sensitive info
                if 'PASSWORD' in var_name:
                    display_value = f"{value[:3]}...{value[-3:]}"
                elif 'EMAIL' in var_name:
                    display_value = f"{value.split('@')[0]}@..."
                else:
                    display_value = value
                
                print_success(f"{description}: {display_value}")
        
        return all_ok
    
    except Exception as e:
        print_error(f"Error reading .env: {str(e)}")
        return False

def check_frontend_structure():
    """Check if frontend structure is correct"""
    print_header("Frontend Structure")
    
    frontend_path = Path('frontend')
    checks = [
        ('frontend/package.json', 'NPM configuration'),
        ('frontend/tsconfig.json', 'TypeScript configuration'),
        ('frontend/vite.config.ts', 'Vite configuration'),
        ('frontend/src', 'Source directory'),
        ('frontend/src/lib/api.ts', 'API service'),
        ('frontend/src/app/components/LiveCameraFeed.tsx', 'Camera component'),
        ('frontend/src/app/pages/LiveDetection.tsx', 'Detection page'),
    ]
    
    all_ok = True
    for path_str, description in checks:
        path = Path(path_str)
        if path.exists():
            if path.is_dir():
                print_success(f"{description} (directory)")
            else:
                print_success(f"{description} (file)")
        else:
            print_error(f"{description} not found at {path_str}")
            all_ok = False
    
    return all_ok

def check_backend_structure():
    """Check if backend structure is correct"""
    print_header("Backend Structure")
    
    checks = [
        ('backend/app.py', 'Flask application'),
        ('backend/email_alert.py', 'Email service'),
        ('backend/jammer_sim.py', 'Jammer simulator'),
        ('logic/threat_engine.py', 'Threat evaluation engine'),
    ]
    
    all_ok = True
    for path_str, description in checks:
        path = Path(path_str)
        if path.exists():
            print_success(f"{description} found")
        else:
            print_error(f"{description} not found at {path_str}")
            all_ok = False
    
    return all_ok

def check_nodejs():
    """Check if Node.js and npm are installed"""
    print_header("Node.js Configuration")
    
    try:
        # Check Node.js
        node_version = subprocess.check_output(['node', '--version'], 
                                               universal_newlines=True).strip()
        print_success(f"Node.js {node_version}")
        
        # Check npm
        npm_version = subprocess.check_output(['npm', '--version'], 
                                              universal_newlines=True).strip()
        print_success(f"npm {npm_version}")
        
        return True
    
    except FileNotFoundError:
        print_error("Node.js or npm not found. Install from https://nodejs.org/")
        return False
    except Exception as e:
        print_error(f"Error checking Node.js: {str(e)}")
        return False

def check_npm_modules():
    """Check if npm modules are installed"""
    print_header("Frontend Dependencies")
    
    node_modules = Path('frontend/node_modules')
    
    if not node_modules.exists():
        print_warning("node_modules directory not found")
        print_info("Run: cd frontend && npm install")
        return False
    
    print_success("node_modules directory found")
    
    # Check key dependencies
    key_packages = [
        'react',
        'react-dom',
        'vite',
    ]
    
    all_ok = True
    for package in key_packages:
        package_dir = node_modules / package
        if package_dir.exists():
            print_success(f"{package} installed")
        else:
            print_error(f"{package} not installed")
            all_ok = False
    
    return all_ok

def test_email_credentials():
    """Test email credentials"""
    print_header("Email Credentials Test")
    
    try:
        from dotenv import load_dotenv
        load_dotenv()
        
        import smtplib
        
        sender_email = os.getenv('SENDER_EMAIL')
        sender_password = os.getenv('SENDER_PASSWORD')
        
        if not sender_email or not sender_password:
            print_warning("Email credentials not configured")
            return False
        
        if sender_email == 'your_email@gmail.com':
            print_warning("Using placeholder email addresses")
            return False
        
        print_info("Testing SMTP connection...")
        
        try:
            server = smtplib.SMTP('smtp.gmail.com', 587)
            server.starttls()
            server.login(sender_email, sender_password)
            server.quit()
            
            print_success("Email credentials valid!")
            print_info(f"Sender: {sender_email.split('@')[0]}@...")
            return True
        
        except smtplib.SMTPAuthenticationError:
            print_error("SMTP Authentication failed - check credentials")
            print_info("For Gmail: Use App Password from https://myaccount.google.com/apppasswords")
            return False
        except smtplib.SMTPException as e:
            print_error(f"SMTP Error: {str(e)}")
            return False
        except Exception as e:
            print_error(f"Connection error: {str(e)}")
            return False
    
    except Exception as e:
        print_error(f"Error testing credentials: {str(e)}")
        return False

def print_summary(results):
    """Print validation summary"""
    print_header("Validation Summary")
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    print(f"{BOLD}Results: {GREEN}{passed}/{total}{RESET} checks passed\n")
    
    for check_name, result in results.items():
        status = f"{GREEN}PASS{RESET}" if result else f"{RED}FAIL{RESET}"
        print(f"  {status} - {check_name}")
    
    print()
    
    if passed == total:
        print(f"{GREEN}{BOLD}✓ All systems ready!{RESET}")
        print(f"{BOLD}Startup commands:{RESET}")
        print(f"  Terminal 1: python backend/app.py")
        print(f"  Terminal 2: cd frontend && npm run dev")
        return True
    else:
        print(f"{RED}{BOLD}✗ Some checks failed. See above for details.{RESET}")
        return False

def main():
    """Run all validation checks"""
    os.chdir(Path(__file__).parent)
    
    print(f"\n{BOLD}{BLUE}")
    print("   ___    ____  ____  ____ ____")
    print("  / _ |  / __ \\/ __ \\/ __ \\\/ __ \\")
    print(" / __ | / /_/ / /_/ / /_/ / /_/ /  AeroGuard AI")
    print("/ ___ |/ _, _/ _, _/ _, _/ _, _/   Environment Validator")
    print("/_/  |_/_/ |_/_/ |_/_/ |_/_/ |_|")
    print(f"{RESET}\n")
    
    results = {
        'Python Version': check_python_version(),
        'Python Packages': check_python_packages(),
        'Environment File': check_env_file(),
        'Backend Structure': check_backend_structure(),
        'Frontend Structure': check_frontend_structure(),
        'Node.js Installation': check_nodejs(),
        'Frontend Dependencies': check_npm_modules(),
        'Email Credentials': test_email_credentials(),
    }
    
    success = print_summary(results)
    
    return 0 if success else 1

if __name__ == '__main__':
    sys.exit(main())
