# 🚀 AeroGuard AI - Deployment Guide

Complete deployment guide for AeroGuard AI with YOLO model integration.

---

## 📋 Prerequisites

- Docker installed (20.10+) - [Install Docker](https://docs.docker.com/get-docker/)
- Docker Compose installed (1.29+)
- Git
- 4GB RAM minimum (8GB recommended for YOLO)
- Internet connection (for initial model download)

---

## 🐳 Docker Deployment (Recommended)

### **Step 1: Prepare Environment Variables**

Create `.env` file in project root:
```env
SENDER_EMAIL=your_email@gmail.com
SENDER_PASSWORD=your_app_password
RECIPIENT_EMAIL=alert@example.com
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
FLASK_ENV=production
FLASK_DEBUG=False
```

**Important:** Get Gmail App Password:
1. Enable 2-Factor Authentication on your Google account
2. Go to [Google Account Security](https://myaccount.google.com/apppasswords)
3. Select "Mail" and "Windows Computer"
4. Copy the generated 16-character password
5. Paste it in `SENDER_PASSWORD`

### **Step 2: Build Docker Image**

```bash
# From project root directory
docker build -t aeroguard-ai:latest .
```

This will:
- Build the React frontend
- Install Python dependencies with YOLO support
- Include the YOLO model (yolov8n.pt)
- Create production-ready container

**Build time:** 10-15 minutes (first build)

### **Step 3: Run with Docker Compose**

```bash
# Start the application
docker-compose up -d

# Check logs
docker-compose logs -f aeroguard-ai

# Stop the application
docker-compose down
```

Access at: **`http://localhost:5000`**

---

## ☁️ Cloud Deployment Options

### **Option A: Docker Hub (Share Image)**

```bash
# Tag image for Docker Hub
docker tag aeroguard-ai:latest yourusername/aeroguard-ai:latest

# Push to Docker Hub
docker login
docker push yourusername/aeroguard-ai:latest

# Anyone can then run:
docker run -p 5000:5000 \
  -e SENDER_EMAIL=your@email.com \
  -e SENDER_PASSWORD=app_password \
  -e RECIPIENT_EMAIL=alert@example.com \
  yourusername/aeroguard-ai:latest
```

### **Option B: AWS EC2**

```bash
# Launch Ubuntu 22.04 instance (t3.medium minimum for YOLO)

# SSH into instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Install Docker
sudo apt-get update
sudo apt-get install -y docker.io docker-compose-plugin

# Clone repository
git clone https://github.com/yourusername/aeroguard-ai.git
cd aeroguard-ai

# Create .env file
nano .env
# Paste your environment variables

# Run with Docker Compose
sudo docker-compose up -d

# Allow HTTP/HTTPS traffic
# Configure security group to allow ports 80, 443, 5000
```

Access at: **`http://your-instance-ip:5000`**

**Cost:** ~$10-20/month (t3.medium)

### **Option C: Google Cloud Run (Serverless)**

⚠️ **Not Recommended** for YOLO - requires <4.5GB memory limit, slower cold starts

### **Option D: AWS Lambda (Serverless)**

⚠️ **Not Recommended** - YOLO model too large for Lambda package limits

### **Option E: DigitalOcean App Platform**

```bash
# 1. Create DigitalOcean account
# 2. Connect GitHub repo
# 3. Create app.yaml:
```

```yaml
name: aeroguard-ai
services:
  - name: api
    github:
      repo: yourusername/aeroguard-ai
      branch: main
    build_command: docker build -t aeroguard-ai .
    run_command: docker run -p 5000:5000 aeroguard-ai
    envs:
      - key: SENDER_EMAIL
        value: ${SENDER_EMAIL}
      - key: SENDER_PASSWORD
        value: ${SENDER_PASSWORD}
      - key: RECIPIENT_EMAIL
        value: ${RECIPIENT_EMAIL}
```

Cost: ~$5-12/month (Basic Container)

### **Option F: Azure Container Instances**

```bash
# Create resource group
az group create --name aeroguard --location eastus

# Build and push to ACR
az acr build -r myregistry -t aeroguard-ai:latest .

# Deploy to ACI
az container create \
  --resource-group aeroguard \
  --name aeroguard-ai \
  --image myregistry.azurecr.io/aeroguard-ai:latest \
  --ports 5000 \
  --environment-variables \
    SENDER_EMAIL='your@email.com' \
    SENDER_PASSWORD='app_password' \
    RECIPIENT_EMAIL='alert@example.com'
```

---

## 📊 Production Setup with Nginx (Advanced)

### **1. Create nginx.conf**

```nginx
upstream aeroguard {
    server aeroguard-ai:5000;
}

server {
    listen 80;
    server_name _;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

    # Cache static files
    location /static {
        proxy_pass http://aeroguard;
        expires 30d;
        access_log off;
    }

    # API endpoints
    location /api {
        limit_req zone=api burst=20;
        proxy_pass http://aeroguard;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Frontend
    location / {
        proxy_pass http://aeroguard;
        proxy_set_header Host $host;
    }
}
```

### **2. Update docker-compose.yml**

Uncomment the nginx service in docker-compose.yml and:

```bash
docker-compose up -d
```

Access at: **`http://localhost:80`** (standard HTTP)

---

## 🔒 Security Checklist

Before production deployment:

- [ ] Change all default credentials
- [ ] Use environment variables for secrets (never commit .env)
- [ ] Enable HTTPS/SSL certificate
- [ ] Set FLASK_DEBUG=False
- [ ] Use strong database passwords
- [ ] Limit API rate limits
- [ ] Enable Docker security scanning
- [ ] Regular security updates
- [ ] Monitor logs and alerts

---

## 📈 Performance Optimization

### **For YOLO Detection (GPU Acceleration)**

If using GPU instance:

```yaml
# Update docker-compose.yml
services:
  aeroguard-ai:
    runtime: nvidia  # Requires nvidia-docker
    environment:
      - CUDA_VISIBLE_DEVICES=0
```

### **Scaling**

For high traffic, use Kubernetes:

```bash
kubectl apply -f deployment.yaml
kubectl autoscale deployment aeroguard-ai --min=2 --max=10
```

---

## 🐛 Troubleshooting

### **Container won't start**

```bash
# Check logs
docker-compose logs aeroguard-ai

# Common issues:
# 1. Port 5000 already in use
docker ps  # Find conflicting container
docker stop <container_id>

# 2. Out of memory
# Increase Docker memory limit
# Docker Desktop → Settings → Resources → Memory
```

### **Email not sending**

```bash
# Test email directly in container
docker-compose exec aeroguard-ai python test_email_direct.py
```

### **YOLO model not loading**

```bash
# Verify model file
ls -lh yolov8n.pt

# Download fresh model
docker-compose exec aeroguard-ai python -c "from ultralytics import YOLO; YOLO('yolov8n.pt')"
```

---

## 📞 Support & Monitoring

### **Health Check**

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "service": "AeroGuard AI Backend",
  "status": "operational",
  "timestamp": "2026-02-06T14:50:15.250358",
  "version": "1.0.0"
}
```

### **View Logs**

```bash
# Real-time logs
docker-compose logs -f aeroguard-ai

# Save logs to file
docker-compose logs aeroguard-ai > logs.txt
```

---

## 🎯 Recommended Deployment Path

1. **Development**: Local with `npm run dev` + `python backend/app.py`
2. **Testing**: Docker locally with `docker-compose up`
3. **Production**: AWS EC2/DigitalOcean with Docker Compose + Nginx
4. **Scale**: Kubernetes for multi-region deployment

---

## 📚 Next Steps

- [ ] Set up GitHub Actions for CI/CD
- [ ] Configure automated backups
- [ ] Set up monitoring (Prometheus, Grafana)
- [ ] Implement API authentication
- [ ] Add database for persistent threat logs
- [ ] Set up SSL certificates

Questions? Check deployment logs with: `docker-compose logs -f`
