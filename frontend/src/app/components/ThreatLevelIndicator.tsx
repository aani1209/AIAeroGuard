import { motion } from 'motion/react';
import { Shield, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';

type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export function ThreatLevelIndicator() {
  const [threatLevel, setThreatLevel] = useState<ThreatLevel>('HIGH');
  const [threatScore, setThreatScore] = useState(78);

  const getThreatColor = () => {
    switch (threatLevel) {
      case 'LOW':
        return '#00ff88';
      case 'MEDIUM':
        return '#ffcc00';
      case 'HIGH':
        return '#ff0040';
    }
  };

  const getThreatPercentage = () => {
    switch (threatLevel) {
      case 'LOW':
        return 25;
      case 'MEDIUM':
        return 55;
      case 'HIGH':
        return 78;
    }
  };

  return (
    <div className="bg-[#1a1f35] rounded-xl border border-[#1e293b] p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Shield size={20} className="text-[#00d4ff]" />
        <h3 className="font-semibold text-white">Threat Level</h3>
      </div>

      {/* Circular Meter */}
      <div className="flex flex-col items-center">
        <div className="relative w-48 h-48">
          {/* Background circle */}
          <svg className="w-48 h-48 transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="80"
              stroke="#1e293b"
              strokeWidth="12"
              fill="none"
            />
            {/* Animated progress circle */}
            <motion.circle
              cx="96"
              cy="96"
              r="80"
              stroke={getThreatColor()}
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDasharray: '0 502' }}
              animate={{
                strokeDasharray: `${(getThreatPercentage() / 100) * 502} 502`,
              }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{
                filter: `drop-shadow(0 0 10px ${getThreatColor()}80)`,
              }}
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {threatLevel === 'HIGH' && (
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <AlertTriangle size={40} className="text-[#ff0040] mb-2" />
              </motion.div>
            )}
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="text-5xl font-bold"
              style={{ color: getThreatColor() }}
            >
              {threatScore}
            </motion.div>
            <div className="text-sm text-gray-400 mt-1">Threat Score</div>
          </div>
        </div>

        {/* Status Badge */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 px-6 py-3 rounded-lg font-bold text-lg tracking-wider"
          style={{
            backgroundColor: `${getThreatColor()}20`,
            color: getThreatColor(),
            border: `2px solid ${getThreatColor()}`,
          }}
        >
          {threatLevel === 'HIGH' && (
            <motion.span
              animate={{
                opacity: [1, 0.6, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
              }}
            >
              ⚠ {threatLevel} THREAT
            </motion.span>
          )}
          {threatLevel !== 'HIGH' && `${threatLevel} THREAT`}
        </motion.div>

        {/* Threat breakdown */}
        <div className="w-full mt-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Active Drones</span>
            <span className="text-white font-semibold">2</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Restricted Zone Breach</span>
            <span className="text-[#ff0040] font-semibold">Yes</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Response Protocol</span>
            <span className="text-[#00d4ff] font-semibold">Engaged</span>
          </div>
        </div>
      </div>
    </div>
  );
}
