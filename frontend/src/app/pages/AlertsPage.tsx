import { motion } from 'motion/react';
import { Bell, Mail, Radio, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';

// Mock alert data
const mockAlerts = [
  {
    id: 1,
    type: 'email',
    title: 'Email Alert Sent',
    message: 'High threat detected in Sector A-3. Alert email sent to admin@aeroguard.ai',
    timestamp: '2026-02-03 14:32:45',
    status: 'success',
    severity: 'high',
  },
  {
    id: 2,
    type: 'jammer',
    title: 'Jammer Activated',
    message: 'RF jammer successfully activated in response to critical threat',
    timestamp: '2026-02-03 14:28:12',
    status: 'success',
    severity: 'critical',
  },
  {
    id: 3,
    type: 'manual',
    title: 'Manual Override Triggered',
    message: 'Operator manually triggered security protocol for Sector B-1',
    timestamp: '2026-02-03 14:15:33',
    status: 'success',
    severity: 'medium',
  },
  {
    id: 4,
    type: 'email',
    title: 'Email Delivery Failed',
    message: 'Failed to send alert email. SMTP connection timeout.',
    timestamp: '2026-02-03 14:02:18',
    status: 'error',
    severity: 'high',
  },
  {
    id: 5,
    type: 'jammer',
    title: 'Jammer Deactivated',
    message: 'RF jammer automatically deactivated after 30-second cycle',
    timestamp: '2026-02-03 13:58:47',
    status: 'success',
    severity: 'low',
  },
  {
    id: 6,
    type: 'email',
    title: 'Email Alert Sent',
    message: 'Medium threat detected in Sector C-2. Alert email sent successfully',
    timestamp: '2026-02-03 13:45:22',
    status: 'success',
    severity: 'medium',
  },
  {
    id: 7,
    type: 'manual',
    title: 'Manual Inspection Required',
    message: 'Unusual drone activity pattern detected. Manual verification needed',
    timestamp: '2026-02-03 13:32:10',
    status: 'pending',
    severity: 'medium',
  },
  {
    id: 8,
    type: 'email',
    title: 'Daily Report Sent',
    message: 'Daily security summary report sent to all administrators',
    timestamp: '2026-02-03 13:18:55',
    status: 'success',
    severity: 'low',
  },
];

export function AlertsPage() {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'email':
        return Mail;
      case 'jammer':
        return Radio;
      case 'manual':
        return AlertTriangle;
      default:
        return Bell;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return CheckCircle;
      case 'error':
        return XCircle;
      case 'pending':
        return Clock;
      default:
        return Bell;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'pending':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'email':
        return 'bg-blue-500/10';
      case 'jammer':
        return 'bg-red-500/10';
      case 'manual':
        return 'bg-yellow-500/10';
      default:
        return 'bg-gray-500/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">System Alerts</h1>
        <p className="text-gray-400">Real-time notifications and automated response actions</p>
      </motion.div>

      {/* Alert Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {[
          {
            label: 'Total Alerts',
            value: mockAlerts.length,
            icon: Bell,
            color: 'cyan',
          },
          {
            label: 'Emails Sent',
            value: mockAlerts.filter((a) => a.type === 'email' && a.status === 'success').length,
            icon: Mail,
            color: 'blue',
          },
          {
            label: 'Jammer Actions',
            value: mockAlerts.filter((a) => a.type === 'jammer').length,
            icon: Radio,
            color: 'red',
          },
          {
            label: 'Manual Overrides',
            value: mockAlerts.filter((a) => a.type === 'manual').length,
            icon: AlertTriangle,
            color: 'yellow',
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 + index * 0.05 }}
            className="bg-[#0f1628] border border-cyan-500/30 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg bg-${stat.color}-500/10 flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
              </div>
            </div>
            <div className={`text-3xl font-bold text-${stat.color}-400 mb-1`}>{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Alerts Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#0f1628] border border-cyan-500/30 rounded-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Recent Alerts</h2>
          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
            Live Updates
          </Badge>
        </div>

        <div className="space-y-4">
          {mockAlerts.map((alert, index) => {
            const AlertIcon = getAlertIcon(alert.type);
            const StatusIcon = getStatusIcon(alert.status);

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
                className={`border border-cyan-500/20 rounded-lg p-4 ${getAlertTypeColor(alert.type)} hover:border-cyan-500/40 transition-colors`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-[#0a0e1a] border border-cyan-500/30 flex items-center justify-center">
                      <AlertIcon className="w-6 h-6 text-cyan-400" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-lg font-semibold text-white">{alert.title}</h3>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <StatusIcon className={`w-5 h-5 ${getStatusColor(alert.status)}`} />
                      </div>
                    </div>

                    <p className="text-gray-400 mb-2">{alert.message}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{alert.timestamp}</span>
                      </div>
                      <div className={`flex items-center gap-1 ${getStatusColor(alert.status)}`}>
                        <span className={`w-2 h-2 rounded-full ${alert.status === 'success' ? 'bg-green-400' : alert.status === 'error' ? 'bg-red-400' : 'bg-yellow-400'}`} />
                        <span className="capitalize">{alert.status}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Animated border for new alerts */}
                {index === 0 && (
                  <motion.div
                    className="absolute inset-0 rounded-lg border-2 border-cyan-400/50 pointer-events-none"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Alert Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Alert Types Distribution */}
        <div className="bg-[#0f1628] border border-cyan-500/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Alert Types</h3>
          <div className="space-y-4">
            {[
              { type: 'Email Alerts', count: 4, color: 'blue', icon: Mail },
              { type: 'Jammer Actions', count: 2, color: 'red', icon: Radio },
              { type: 'Manual Overrides', count: 2, color: 'yellow', icon: AlertTriangle },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded bg-${item.color}-500/10 flex items-center justify-center`}>
                  <item.icon className={`w-4 h-4 text-${item.color}-400`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-300">{item.type}</span>
                    <span className={`text-sm font-semibold text-${item.color}-400`}>{item.count}</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-${item.color}-500`}
                      style={{ width: `${(item.count / mockAlerts.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alert Status Distribution */}
        <div className="bg-[#0f1628] border border-cyan-500/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Alert Status</h3>
          <div className="space-y-4">
            {[
              {
                status: 'Success',
                count: mockAlerts.filter((a) => a.status === 'success').length,
                color: 'green',
                icon: CheckCircle,
              },
              {
                status: 'Pending',
                count: mockAlerts.filter((a) => a.status === 'pending').length,
                color: 'yellow',
                icon: Clock,
              },
              {
                status: 'Error',
                count: mockAlerts.filter((a) => a.status === 'error').length,
                color: 'red',
                icon: XCircle,
              },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded bg-${item.color}-500/10 flex items-center justify-center`}>
                  <item.icon className={`w-4 h-4 text-${item.color}-400`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-300">{item.status}</span>
                    <span className={`text-sm font-semibold text-${item.color}-400`}>{item.count}</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-${item.color}-500`}
                      style={{ width: `${(item.count / mockAlerts.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
