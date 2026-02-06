import { LiveCameraFeed } from '@/app/components/LiveCameraFeed';
import { ThreatLevelIndicator } from '@/app/components/ThreatLevelIndicator';
import { AlertsPanel } from '@/app/components/AlertsPanel';
import { SystemMetrics } from '@/app/components/SystemMetrics';
import { motion } from 'motion/react';
import { Activity, Clock } from 'lucide-react';

export function Dashboard() {
  // Mock recent activity data
  const recentActivity = [
    { time: '14:32:45', event: 'Drone detected - Medium threat', status: 'warning' },
    { time: '14:28:12', event: 'Email alert sent to admin', status: 'success' },
    { time: '14:15:33', event: 'System health check passed', status: 'success' },
    { time: '14:02:18', event: 'Camera 2 - Minor detection', status: 'info' },
    { time: '13:58:47', event: 'Threat neutralized', status: 'success' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-8"
    >
      {/* System Metrics */}
      <SystemMetrics />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Camera Feed - Takes 2 columns */}
        <div className="lg:col-span-2">
          <LiveCameraFeed />
        </div>

        {/* Threat Level Indicator */}
        <div>
          <ThreatLevelIndicator />
        </div>
      </div>

      {/* Bottom Section - Alerts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Timeline */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#0f1628] border border-cyan-500/30 rounded-lg p-6 h-[500px] flex flex-col"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                <p className="text-sm text-gray-400">Last 2 hours</p>
              </div>
            </div>

            <div className="flex-1 overflow-auto space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex gap-3"
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        activity.status === 'warning'
                          ? 'bg-yellow-400'
                          : activity.status === 'success'
                          ? 'bg-green-400'
                          : 'bg-cyan-400'
                      }`}
                    />
                    {index < recentActivity.length - 1 && (
                      <div className="w-0.5 h-full bg-cyan-500/20 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">{activity.time}</span>
                    </div>
                    <p className="text-sm text-gray-300">{activity.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Alerts Panel - Takes 2 columns */}
        <div className="lg:col-span-2 h-[500px]">
          <AlertsPanel />
        </div>
      </div>
    </motion.div>
  );
}
