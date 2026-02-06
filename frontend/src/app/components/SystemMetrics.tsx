import { motion } from 'motion/react';
import { Activity, Zap, Camera, Cpu } from 'lucide-react';

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  change?: string;
  status: 'good' | 'warning' | 'critical';
  delay?: number;
}

function MetricCard({ icon, label, value, change, status, delay = 0 }: MetricCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'good':
        return '#00ff88';
      case 'warning':
        return '#ffcc00';
      case 'critical':
        return '#ff0040';
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-[#1a1f35] rounded-xl border border-[#1e293b] p-6 shadow-lg hover:border-[#00d4ff] transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <motion.div
          className="w-12 h-12 rounded-lg flex items-center justify-center bg-linear-to-br from-[#00d4ff]/20 to-[#00ffff]/20 border border-[#00d4ff]/30"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <div className="text-[#00d4ff]">{icon}</div>
        </motion.div>

        {change && (
          <div
            className="text-xs px-2 py-1 rounded-full font-semibold"
            style={{
              backgroundColor: `${getStatusColor()}20`,
              color: getStatusColor(),
            }}
          >
            {change}
          </div>
        )}
      </div>

      <div>
        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        <div className="text-sm text-gray-400">{label}</div>
      </div>

      {/* Animated bottom border on hover */}
      <motion.div
        className="h-1 rounded-full mt-4"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          transformOrigin: 'left',
          backgroundColor: getStatusColor(),
          boxShadow: `0 0 10px ${getStatusColor()}80`,
        }}
      />
    </motion.div>
  );
}

export function SystemMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        icon={<Activity size={24} />}
        label="Detection Confidence"
        value="92%"
        change="+5%"
        status="good"
        delay={0}
      />
      <MetricCard
        icon={<Zap size={24} />}
        label="Response Time"
        value="1.2s"
        change="Optimal"
        status="good"
        delay={0.1}
      />
      <MetricCard
        icon={<Camera size={24} />}
        label="Active Cameras"
        value="8/12"
        change="4 Offline"
        status="warning"
        delay={0.2}
      />
      <MetricCard
        icon={<Cpu size={24} />}
        label="Model Status"
        value="YOLOv8"
        change="ACTIVE"
        status="good"
        delay={0.3}
      />
    </div>
  );
}
