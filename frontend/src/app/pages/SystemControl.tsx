import { motion } from 'motion/react';
import { useState } from 'react';
import { Power, Mail, Radio, AlertTriangle, CheckCircle, Shield, Eye } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Switch } from '@/app/components/ui/switch';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';

export function SystemControl() {
  const [aiDetection, setAiDetection] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [jammerSimulation, setJammerSimulation] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleToggle = (setting: string, value: boolean) => {
    const settingName = setting.replace(/([A-Z])/g, ' $1').trim();
    setFeedbackMessage(`${settingName} ${value ? 'enabled' : 'disabled'} successfully`);
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  const handleManualTrigger = () => {
    setFeedbackMessage('⚠️ MANUAL OVERRIDE ACTIVATED - Security protocols engaged');
    setTimeout(() => setFeedbackMessage(''), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">System Control Panel</h1>
        <p className="text-gray-400">Manage detection systems, alerts, and security protocols</p>
      </motion.div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#0f1628] border border-cyan-500/30 rounded-lg p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-linear-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-cyan-500/30">
              <Shield className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">AeroGuard AI System</h2>
              <p className="text-gray-400">Version 2.1.4 - Build 20260203</p>
            </div>
          </div>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/50 px-4 py-2">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
            ONLINE
          </Badge>
        </div>
      </motion.div>

      {/* Feedback Message */}
      {feedbackMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4"
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-400">{feedbackMessage}</span>
          </div>
        </motion.div>
      )}

      {/* Control Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Detection Control */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#0f1628] border border-cyan-500/30 rounded-lg p-6"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <Eye className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">AI Detection</h3>
                <p className="text-sm text-gray-400">Real-time drone detection system</p>
              </div>
            </div>
            <Switch
              checked={aiDetection}
              onCheckedChange={(checked: boolean) => {
                setAiDetection(checked);
                handleToggle('AI Detection', checked);
              }}
              className="data-[state=checked]:bg-cyan-500"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Status:</span>
              <span className={aiDetection ? 'text-green-400' : 'text-gray-400'}>
                {aiDetection ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">AI Model:</span>
              <span className="text-white">YOLOv8</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Confidence Threshold:</span>
              <span className="text-white">85%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Detection Rate:</span>
              <span className="text-cyan-400">{aiDetection ? '99.8%' : 'N/A'}</span>
            </div>
          </div>

          {aiDetection && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg"
            >
              <div className="flex items-center gap-2 text-sm text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span>Detection system is actively monitoring airspace</span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Email Alerts Control */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#0f1628] border border-cyan-500/30 rounded-lg p-6"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Email Alerts</h3>
                <p className="text-sm text-gray-400">Automated threat notifications</p>
              </div>
            </div>
            <Switch
              checked={emailAlerts}
              onCheckedChange={(checked: boolean) => {
                setEmailAlerts(checked);
                handleToggle('Email Alerts', checked);
              }}
              className="data-[state=checked]:bg-blue-500"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Status:</span>
              <span className={emailAlerts ? 'text-green-400' : 'text-gray-400'}>
                {emailAlerts ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Recipients:</span>
              <span className="text-white">3 admins</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Alert Threshold:</span>
              <span className="text-white">Medium & Above</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Emails Sent Today:</span>
              <span className="text-blue-400">{emailAlerts ? '47' : '0'}</span>
            </div>
          </div>

          {emailAlerts && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg"
            >
              <div className="flex items-center gap-2 text-sm text-blue-400">
                <CheckCircle className="w-4 h-4" />
                <span>Email notifications are active and sending</span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Jammer Simulation Control */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#0f1628] border border-red-500/30 rounded-lg p-6"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Radio className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Jammer Simulation</h3>
                <p className="text-sm text-gray-400">RF interference countermeasure</p>
              </div>
            </div>
            <Switch
              checked={jammerSimulation}
              onCheckedChange={(checked: boolean) => {
                setJammerSimulation(checked);
                handleToggle('Jammer Simulation', checked);
              }}
              className="data-[state=checked]:bg-red-500"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Status:</span>
              <span className={jammerSimulation ? 'text-red-400' : 'text-gray-400'}>
                {jammerSimulation ? 'Armed' : 'Standby'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Frequency Range:</span>
              <span className="text-white">2.4-5.8 GHz</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Effective Range:</span>
              <span className="text-white">500m radius</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Auto-Trigger:</span>
              <span className="text-red-400">{jammerSimulation ? 'On High Threat' : 'Disabled'}</span>
            </div>
          </div>

          {jammerSimulation ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
            >
              <div className="flex items-center gap-2 text-sm text-red-400">
                <AlertTriangle className="w-4 h-4" />
                <span>Jammer armed - Will activate on critical threats</span>
              </div>
            </motion.div>
          ) : (
            <div className="mt-4 p-3 bg-gray-500/10 border border-gray-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Power className="w-4 h-4" />
                <span>Jammer in standby mode - Enable for active threats</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Manual Override */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#0f1628] border border-yellow-500/30 rounded-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Manual Override</h3>
              <p className="text-sm text-gray-400">Emergency security protocol</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-sm text-yellow-400 mb-3">
                ⚠️ This will manually trigger all security protocols, including email alerts and jammer activation. Use only in emergency situations.
              </p>
            </div>

            <Button
              onClick={handleManualTrigger}
              className="w-full bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-lg py-6 shadow-lg shadow-red-500/50"
            >
              <AlertTriangle className="w-5 h-5 mr-2" />
              MANUAL TRIGGER
            </Button>

            <div className="space-y-2 text-xs text-gray-400">
              <p>• Activates all cameras to maximum sensitivity</p>
              <p>• Sends priority alerts to all administrators</p>
              <p>• Enables RF jammer if armed</p>
              <p>• Logs event in system audit trail</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* System Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-[#0f1628] border border-cyan-500/30 rounded-lg p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-4">System Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <Label className="text-gray-400 text-sm">Uptime</Label>
            <p className="text-white text-lg font-semibold mt-1">47h 23m</p>
          </div>
          <div>
            <Label className="text-gray-400 text-sm">Active Cameras</Label>
            <p className="text-white text-lg font-semibold mt-1">4 / 4</p>
          </div>
          <div>
            <Label className="text-gray-400 text-sm">CPU Usage</Label>
            <p className="text-white text-lg font-semibold mt-1">34%</p>
          </div>
          <div>
            <Label className="text-gray-400 text-sm">Memory</Label>
            <p className="text-white text-lg font-semibold mt-1">2.8 / 8 GB</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
