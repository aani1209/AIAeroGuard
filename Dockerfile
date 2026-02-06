# Multi-stage build for AeroGuard AI (with YOLO)
FROM node:20-alpine AS frontend-builder

WORKDIR /build

# Copy frontend files
COPY frontend/package*.json ./
RUN npm install

COPY frontend . 
RUN npm run build

# Python backend with YOLO support
FROM python:3.13-slim

WORKDIR /app

# Install system dependencies for YOLO and ML
RUN apt-get update && apt-get install -y \
    libsm6 libxext6 libxrender-dev \
    libgomp1 \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Copy backend code
COPY backend ./backend
COPY logic ./logic
COPY vision ./vision
COPY jammer_sim.py .

# Copy pre-built YOLO model
COPY yolov8n.pt .

# Copy frontend build from builder stage
COPY --from=frontend-builder /build/dist ./frontend/dist

# Set environment variables
ENV FLASK_APP=backend/app.py
ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:5000/api/health').read()"

# Run with gunicorn for production
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "--timeout", "60", "backend.app:app"]
