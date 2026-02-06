import { motion, AnimatePresence } from 'motion/react';
import { Bell, Mail, Radio, Shield, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Alert {
  id: number;
  type: 'detection' | 'system' | 'jammer' | 'email';
  message: string;
  time: string;
  severity: 'low' | 'medium' | 'high';
}

export function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 1,
      type: 'detection',
      message: 'Unauthorized drone detected in Zone A',
      time: '2 min ago',
      severity: 'high',
    },
    {
      id: 2,
      type: 'jammer',
      message: 'Jammer activated - Signal disruption active',
      time: '3 min ago',
      severity: 'medium',
    },
    {
      id: 3,
      type: 'email',
      message: 'Alert notification sent to security team',
      time: '5 min ago',
      severity: 'low',
    },
    {
      id: 4,
      type: 'detection',
      message: 'Multiple drones detected - perimeter breach',
      time: '8 min ago',
      severity: 'high',
    },
    {
      id: 5,
      type: 'system',
      message: 'System health check completed - All OK',
      time: '15 min ago',
      severity: 'low',
    },
  ]);

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'detection':
        return <Shield size={16} />;
      case 'jammer':
        return <Radio size={16} />;
      case 'email':
        return <Mail size={16} />;
      case 'system':
        return <Bell size={16} />;
    }
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'low':
        return '#00ff88';
      case 'medium':
        return '#ffcc00';
      case 'high':
        return '#ff0040';
    }
  };

  return (
    <div className="bg-[#1a1f35] rounded-xl border border-[#1e293b] overflow-hidden shadow-lg h-full flex flex-col">
      {/* Header */}
      <div className="bg-[#0f1421] border-b border-[#1e293b] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell size={20} className="text-[#00d4ff]" />
          <h3 className="font-semibold text-white">Real-time Alerts</h3>
        </div>
        <div className="bg-[#ff0040] text-white text-xs px-2.5 py-1 rounded-full font-bold">
          {alerts.filter((a) => a.severity === 'high').length} CRITICAL
        </div>
      </div>

      {/* Alerts List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {alerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#0f1421] rounded-lg border border-[#1e293b] p-4 hover:border-[#00d4ff] transition-colors group"
              style={{
                borderLeftWidth: '3px',
                borderLeftColor: getSeverityColor(alert.severity),
              }}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <motion.div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: `${getSeverityColor(alert.severity)}20`,
                    color: getSeverityColor(alert.severity),
                  }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {getAlertIcon(alert.type)}
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white leading-relaxed">{alert.message}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                    <Clock size={12} />
                    <span>{alert.time}</span>
                  </div>
                </div>

                {/* Severity indicator */}
                {alert.severity === 'high' && (
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                    className="w-2 h-2 rounded-full bg-[#ff0040] shadow-[0_0_10px_rgba(255,0,64,0.8)]"
                  />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="bg-[#0f1421] border-t border-[#1e293b] px-6 py-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-2 text-sm text-[#00d4ff] hover:text-[#00ffff] transition-colors font-semibold"
        >
          View All Alerts →
        </motion.button>
      </div>
    </div>
  );
}
