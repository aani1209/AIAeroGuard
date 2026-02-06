import { motion } from 'motion/react';
import { useState } from 'react';
import { Play, Pause, Camera, Monitor, Radio, AlertTriangle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { api } from '@/lib/api';

export function LiveDetection() {
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [selectedCamera, setSelectedCamera] = useState(1);
  const [isTriggering, setIsTriggering] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string>('');

  // Mock detection data
  const detections = [
    { id: 1, type: 'Drone', confidence: 0.94, x: 35, y: 25, width: 120, height: 80 },
    { id: 2, type: 'Drone', confidence: 0.87, x: 65, y: 55, width: 100, height: 70 },
  ];

  /**
   * Trigger threat alert via backend API
   */
  const handleTriggerAlert = async () => {
    setIsTriggering(true);
    setAlertMessage('Sending threat alert...');

    try {
      console.log('🔵 Starting alert trigger...');
      console.log('📍 Backend URL: http://localhost:5000/api/trigger');
      
      const detection = detections[0];
      const payloadData = {
        threat_detected: true,
        detection: {
          class_name: 'drone',
          confidence: detection.confidence,
          bbox: [detection.x, detection.y, detection.x + detection.width, detection.y + detection.height],
          timestamp: new Date().toISOString(),
          threat_level: 'HIGH',
        },
      };
      
      console.log('📤 Sending payload:', JSON.stringify(payloadData, null, 2));
      
      const response = await api.trigger(payloadData);

      console.log('📥 Response received:', response);
      setAlertMessage('✓ Threat alert sent! Check your email for notification.');

      // Clear message after 3 seconds
      setTimeout(() => setAlertMessage(''), 3000);
    } catch (error: any) {
      console.error('❌ Full error:', error);
      
      // Provide detailed error message
      let errorMsg = '✗ Failed to send alert.';
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMsg = '✗ Cannot reach backend. Is it running on http://localhost:5000?';
      } else if (error.message?.includes('API Error')) {
        errorMsg = `✗ Server error: ${error.message}`;
      } else if (error.message) {
        errorMsg = `✗ Error: ${error.message}`;
      }
      
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });

      setAlertMessage(errorMsg);

      // Clear message after 3 seconds
      setTimeout(() => setAlertMessage(''), 3000);
    } finally {
      setIsTriggering(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Live Detection Feed</h1>
          <p className="text-gray-400">Real-time AI-powered drone surveillance</p>
        </div>

        <div className="flex items-center gap-3">
          <Badge 
            className={`px-4 py-2 text-sm ${
              isMonitoring 
                ? 'bg-green-500/20 text-green-400 border-green-500/50' 
                : 'bg-gray-500/20 text-gray-400 border-gray-500/50'
            }`}
          >
            <span className={`w-2 h-2 rounded-full mr-2 ${isMonitoring ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
            {isMonitoring ? 'Monitoring Airspace' : 'Monitoring Paused'}
          </Badge>
        </div>
      </motion.div>

      {/* Camera Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#0f1628] border border-cyan-500/30 rounded-lg p-4"
      >
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">Camera Source:</span>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((cam) => (
              <Button
                key={cam}
                variant={selectedCamera === cam ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCamera(cam)}
                className={
                  selectedCamera === cam
                    ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
                    : 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10'
                }
              >
                <Camera className="w-4 h-4 mr-2" />
                Camera {cam}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Live Feed */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-[#0f1628] border border-cyan-500/30 rounded-lg overflow-hidden"
      >
        {/* Video Container */}
        <div className="relative aspect-video bg-black">
          {/* Simulated camera feed background */}
          <div className="absolute inset-0 bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Scanning grid overlay */}
            <motion.div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0, 212, 255, 0.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0, 212, 255, 0.3) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
              }}
              animate={{
                backgroundPosition: ['0px 0px', '40px 40px'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            {/* Animated scan line */}
            <motion.div
              className="absolute left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-cyan-400 to-transparent"
              animate={{
                top: ['0%', '100%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            {/* Detection Bounding Boxes */}
            {isMonitoring && detections.map((detection) => (
              <motion.div
                key={detection.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute border-2 border-red-500"
                style={{
                  left: `${detection.x}%`,
                  top: `${detection.y}%`,
                  width: `${detection.width}px`,
                  height: `${detection.height}px`,
                }}
              >
                {/* Detection label */}
                <div className="absolute -top-8 left-0 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
                  {detection.type} {(detection.confidence * 100).toFixed(0)}%
                </div>
                
                {/* Corner markers */}
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-red-500" />
                <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-red-500" />
                <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-red-500" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-red-500" />

                {/* Pulsing effect */}
                <motion.div
                  className="absolute inset-0 border-2 border-red-500"
                  animate={{
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                />
              </motion.div>
            ))}

            {/* HUD Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Top left info */}
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm border border-cyan-500/30 rounded px-3 py-2 text-xs">
                <div className="flex items-center gap-2 text-cyan-400 mb-1">
                  <Radio className="w-3 h-3" />
                  <span>Camera {selectedCamera}</span>
                </div>
                <div className="text-gray-400">1920x1080 • 60fps</div>
              </div>

              {/* Top right timestamp */}
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm border border-cyan-500/30 rounded px-3 py-2 text-xs text-cyan-400">
                {new Date().toLocaleTimeString()}
              </div>

              {/* Bottom left detection count */}
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm border border-red-500/50 rounded px-3 py-2 text-xs">
                <div className="text-red-400 font-semibold">
                  {isMonitoring ? detections.length : 0} Active Detections
                </div>
              </div>

              {/* Bottom right coordinates */}
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm border border-cyan-500/30 rounded px-3 py-2 text-xs text-cyan-400">
                LAT: 37.7749° N, LON: 122.4194° W
              </div>
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="bg-[#0a0e1a] border-t border-cyan-500/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setIsMonitoring(!isMonitoring)}
                className={
                  isMonitoring
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }
              >
                {isMonitoring ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Stop Detection
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Detection
                  </>
                )}
              </Button>

              {/* Alert Trigger Button */}
              <Button
                onClick={handleTriggerAlert}
                disabled={isTriggering}
                className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-900 disabled:opacity-50 text-white"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                {isTriggering ? 'Sending Alert...' : 'Test Threat Alert'}
              </Button>

              <Button
                variant="outline"
                className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
              >
                <Monitor className="w-4 h-4 mr-2" />
                Fullscreen
              </Button>
            </div>

            {/* Alert Status Message */}
            {alertMessage && (
              <div className={`text-xs px-3 py-1 rounded ${alertMessage.includes('✓') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {alertMessage}
              </div>
            )}

            <div className="flex items-center gap-4 text-sm">
              <div className="text-gray-400">
                AI Model: <span className="text-cyan-400">YOLOv8</span>
              </div>
              <div className="text-gray-400">
                Confidence Threshold: <span className="text-cyan-400">85%</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Detection Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total Detections', value: '847', change: '+12%', color: 'cyan' },
          { label: 'High Confidence', value: '794', change: '+8%', color: 'green' },
          { label: 'False Positives', value: '23', change: '-5%', color: 'yellow' },
          { label: 'Avg Confidence', value: '94.2%', change: '+2%', color: 'blue' },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-[#0f1628] border border-cyan-500/30 rounded-lg p-4"
          >
            <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className={`text-xs text-${stat.color}-400`}>{stat.change} from last hour</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
