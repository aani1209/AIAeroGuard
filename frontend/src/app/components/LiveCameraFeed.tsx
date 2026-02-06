import { motion } from 'motion/react';
import { Video, Maximize2, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface DetectedObject {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  label: string;
}

export function LiveCameraFeed() {
  const [scanLine, setScanLine] = useState(0);
  const [detections] = useState<DetectedObject[]>([
    { id: 1, x: 25, y: 30, width: 15, height: 12, confidence: 92, label: 'Drone' },
    { id: 2, x: 65, y: 45, width: 12, height: 10, confidence: 87, label: 'Drone' },
  ]);
  const [isTriggering, setIsTriggering] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string>('');

  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  /**
   * Trigger threat alert via backend API
   */
  const handleTriggerAlert = async () => {
    setIsTriggering(true);
    setAlertMessage('Sending threat alert...');

    try {
      console.log('🔵 Starting alert trigger...');
      console.log('📍 Backend URL: http://localhost:5000/api/trigger');
      
      // Send first detection as HIGH threat
      const detection = detections[0];
      const payloadData = {
        threat_detected: true,
        detection: {
          class_name: 'drone',
          confidence: detection.confidence / 100,
          bbox: [detection.x, detection.y, detection.x + detection.width, detection.y + detection.height],
          timestamp: new Date().toISOString(),
          threat_level: 'HIGH',
        },
      };
      
      console.log('📤 Sending payload:', JSON.stringify(payloadData, null, 2));
      
      const response = await api.trigger(payloadData);

      console.log('📥 Response received:', response);
      setAlertMessage('✓ Threat alert sent! Email should arrive shortly.');
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
    } finally {
      setIsTriggering(false);
    }
  };

  return (
    <div className="bg-[#1a1f35] rounded-xl border border-[#1e293b] overflow-hidden shadow-lg">
      {/* Header */}
      <div className="bg-[#0f1421] border-b border-[#1e293b] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Video size={20} className="text-[#00d4ff]" />
          <div>
            <h3 className="font-semibold text-white">Live Camera Feed</h3>
            <p className="text-xs text-gray-400">CAM-01 • North Perimeter</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Alert Status Message */}
          {alertMessage && (
            <div className={`text-xs px-3 py-1 rounded ${alertMessage.includes('✓') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {alertMessage}
            </div>
          )}
          
          {/* Trigger Alert Button */}
          <motion.button
            onClick={handleTriggerAlert}
            disabled={isTriggering}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:opacity-50 text-white px-3 py-2 rounded text-sm font-semibold transition-colors"
          >
            <AlertTriangle size={16} />
            {isTriggering ? 'Sending...' : 'Test Threat Alert'}
          </motion.button>

          <div className="flex items-center gap-2">
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-red-500"
            />
            <span className="text-xs text-gray-400">RECORDING</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-400 hover:text-[#00d4ff] transition-colors"
          >
            <Maximize2 size={18} />
          </motion.button>
        </div>
      </div>

      {/* Video Feed Area */}
      <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800">
        {/* Simulated video background with grid pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Scanning line effect */}
        <motion.div
          className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#00d4ff] to-transparent shadow-[0_0_10px_rgba(0,212,255,0.8)]"
          style={{ top: `${scanLine}%` }}
        />

        {/* Detection boxes */}
        {detections.map((detection) => (
          <motion.div
            key={detection.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute"
            style={{
              left: `${detection.x}%`,
              top: `${detection.y}%`,
              width: `${detection.width}%`,
              height: `${detection.height}%`,
            }}
          >
            {/* Bounding box */}
            <div className="w-full h-full border-2 border-[#ff0040] relative">
              {/* Corner markers */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#ff0040]" />
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-[#ff0040]" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-[#ff0040]" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#ff0040]" />
              
              {/* Animated border glow */}
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 border-2 border-[#ff0040] shadow-[0_0_15px_rgba(255,0,64,0.5)]"
              />
            </div>

            {/* Label badge */}
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute -top-8 left-0 bg-[#ff0040] px-3 py-1 rounded text-xs font-bold text-white shadow-lg whitespace-nowrap"
            >
              {detection.label} • {detection.confidence}%
            </motion.div>
          </motion.div>
        ))}

        {/* Crosshair overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#00d4ff]/30 to-transparent" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00d4ff]/30 to-transparent" />
        </div>

        {/* Info overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div className="bg-black/60 backdrop-blur-sm px-3 py-2 rounded border border-[#1e293b]">
            <div className="text-[10px] text-gray-400 uppercase tracking-wider">Detections</div>
            <div className="text-xl font-bold text-[#ff0040]">{detections.length}</div>
          </div>
          
          <div className="bg-black/60 backdrop-blur-sm px-3 py-2 rounded border border-[#1e293b]">
            <div className="text-[10px] text-gray-400 uppercase tracking-wider">Model</div>
            <div className="text-sm font-semibold text-[#00ff88]">YOLOv8 • ACTIVE</div>
          </div>
        </div>
      </div>
    </div>
  );
}
