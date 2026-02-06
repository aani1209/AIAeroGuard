import { motion } from 'motion/react';
import { useState } from 'react';
import { Save, Mail, AlertCircle, Server, Palette, Bell, Shield, User } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

export function Settings() {
  const [emailConfig, setEmailConfig] = useState({
    smtpServer: 'smtp.aeroguard.ai',
    smtpPort: '587',
    senderEmail: 'alerts@aeroguard.ai',
    recipientEmails: 'admin@aeroguard.ai, security@aeroguard.ai',
  });

  const [alertThresholds, setAlertThresholds] = useState({
    low: '60',
    medium: '75',
    high: '90',
  });

  const [apiConfig, setApiConfig] = useState({
    endpoint: 'https://api.aeroguard.ai/v1',
    apiKey: '••••••••••••••••',
  });

  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState({
    email: true,
    sound: true,
    desktop: false,
  });

  const [saveMessage, setSaveMessage] = useState('');

  const handleSave = () => {
    setSaveMessage('Settings saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Configure system preferences and security settings</p>
      </motion.div>

      {/* Save Message */}
      {saveMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="bg-green-500/10 border border-green-500/30 rounded-lg p-4"
        >
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="text-green-400">{saveMessage}</span>
          </div>
        </motion.div>
      )}

      {/* Settings Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#0f1628] border border-cyan-500/30 rounded-lg overflow-hidden"
      >
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="w-full justify-start border-b border-cyan-500/20 bg-[#0a0e1a] rounded-none p-0">
            <TabsTrigger
              value="email"
              className="data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400 data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 rounded-none px-6 py-3"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger
              value="alerts"
              className="data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400 data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 rounded-none px-6 py-3"
            >
              <Bell className="w-4 h-4 mr-2" />
              Alerts
            </TabsTrigger>
            <TabsTrigger
              value="api"
              className="data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400 data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 rounded-none px-6 py-3"
            >
              <Server className="w-4 h-4 mr-2" />
              API
            </TabsTrigger>
            <TabsTrigger
              value="appearance"
              className="data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400 data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 rounded-none px-6 py-3"
            >
              <Palette className="w-4 h-4 mr-2" />
              Appearance
            </TabsTrigger>
            <TabsTrigger
              value="account"
              className="data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400 data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 rounded-none px-6 py-3"
            >
              <User className="w-4 h-4 mr-2" />
              Account
            </TabsTrigger>
          </TabsList>

          {/* Email Configuration */}
          <TabsContent value="email" className="p-6 space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Email Configuration</h3>
              <p className="text-gray-400 mb-6">Configure SMTP settings for alert notifications</p>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpServer" className="text-gray-300">SMTP Server</Label>
                    <Input
                      id="smtpServer"
                      value={emailConfig.smtpServer}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailConfig({ ...emailConfig, smtpServer: e.target.value })}
                      className="bg-[#0a0e1a] border-cyan-500/30 focus:border-cyan-500 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort" className="text-gray-300">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      value={emailConfig.smtpPort}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailConfig({ ...emailConfig, smtpPort: e.target.value })}
                      className="bg-[#0a0e1a] border-cyan-500/30 focus:border-cyan-500 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="senderEmail" className="text-gray-300">Sender Email Address</Label>
                  <Input
                    id="senderEmail"
                    type="email"
                    value={emailConfig.senderEmail}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailConfig({ ...emailConfig, senderEmail: e.target.value })}
                    className="bg-[#0a0e1a] border-cyan-500/30 focus:border-cyan-500 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recipientEmails" className="text-gray-300">
                    Recipient Email Addresses
                    <span className="text-gray-500 text-sm ml-2">(comma-separated)</span>
                  </Label>
                  <Input
                    id="recipientEmails"
                    value={emailConfig.recipientEmails}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailConfig({ ...emailConfig, recipientEmails: e.target.value })}
                    className="bg-[#0a0e1a] border-cyan-500/30 focus:border-cyan-500 text-white"
                  />
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                    <div className="text-sm text-blue-400">
                      <p className="font-semibold mb-1">SMTP Configuration</p>
                      <p>Make sure your SMTP server allows connections from this application. Some providers require app-specific passwords.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Alert Thresholds */}
          <TabsContent value="alerts" className="p-6 space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Alert Thresholds</h3>
              <p className="text-gray-400 mb-6">Set confidence thresholds for different threat levels</p>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="lowThreshold" className="text-gray-300">Low Threat</Label>
                      <span className="text-green-400 font-semibold">{alertThresholds.low}%</span>
                    </div>
                    <Input
                      id="lowThreshold"
                      type="range"
                      min="0"
                      max="100"
                      value={alertThresholds.low}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAlertThresholds({ ...alertThresholds, low: e.target.value })}
                      className="w-full"
                    />
                    <p className="text-sm text-gray-500 mt-1">Detections with confidence ≥ {alertThresholds.low}%</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="mediumThreshold" className="text-gray-300">Medium Threat</Label>
                      <span className="text-yellow-400 font-semibold">{alertThresholds.medium}%</span>
                    </div>
                    <Input
                      id="mediumThreshold"
                      type="range"
                      min="0"
                      max="100"
                      value={alertThresholds.medium}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAlertThresholds({ ...alertThresholds, medium: e.target.value })}
                      className="w-full"
                    />
                    <p className="text-sm text-gray-500 mt-1">Detections with confidence ≥ {alertThresholds.medium}%</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="highThreshold" className="text-gray-300">High Threat</Label>
                      <span className="text-red-400 font-semibold">{alertThresholds.high}%</span>
                    </div>
                    <Input
                      id="highThreshold"
                      type="range"
                      min="0"
                      max="100"
                      value={alertThresholds.high}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAlertThresholds({ ...alertThresholds, high: e.target.value })}
                      className="w-full"
                    />
                    <p className="text-sm text-gray-500 mt-1">Detections with confidence ≥ {alertThresholds.high}%</p>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />
                    <div className="text-sm text-yellow-400">
                      <p className="font-semibold mb-1">Threshold Guidelines</p>
                      <p>Lower thresholds increase sensitivity but may result in more false positives. Adjust based on your security requirements.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-white">Notification Preferences</h4>
                  
                  <div className="flex items-center justify-between py-3 border-b border-cyan-500/10">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-white">Email Notifications</p>
                        <p className="text-sm text-gray-400">Receive alerts via email</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked: boolean) => setNotifications({ ...notifications, email: checked })}
                      className="data-[state=checked]:bg-cyan-500"
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-cyan-500/10">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-yellow-400" />
                      <div>
                        <p className="text-white">Sound Alerts</p>
                        <p className="text-sm text-gray-400">Play sound for high threats</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.sound}
                      onCheckedChange={(checked: boolean) => setNotifications({ ...notifications, sound: checked })}
                      className="data-[state=checked]:bg-cyan-500"
                    />
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-cyan-400" />
                      <div>
                        <p className="text-white">Desktop Notifications</p>
                        <p className="text-sm text-gray-400">Browser push notifications</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.desktop}
                      onCheckedChange={(checked: boolean) => setNotifications({ ...notifications, desktop: checked })}
                      className="data-[state=checked]:bg-cyan-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* API Configuration */}
          <TabsContent value="api" className="p-6 space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">API Configuration</h3>
              <p className="text-gray-400 mb-6">Configure API endpoints and authentication</p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiEndpoint" className="text-gray-300">API Endpoint</Label>
                  <Input
                    id="apiEndpoint"
                    value={apiConfig.endpoint}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApiConfig({ ...apiConfig, endpoint: e.target.value })}
                    className="bg-[#0a0e1a] border-cyan-500/30 focus:border-cyan-500 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiKey" className="text-gray-300">API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={apiConfig.apiKey}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApiConfig({ ...apiConfig, apiKey: e.target.value })}
                    className="bg-[#0a0e1a] border-cyan-500/30 focus:border-cyan-500 text-white"
                  />
                  <p className="text-sm text-gray-500">Your API key is encrypted and stored securely</p>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Server className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
                    <div className="text-sm text-cyan-400">
                      <p className="font-semibold mb-1">API Integration</p>
                      <p>Connect to external services for advanced threat intelligence and reporting capabilities.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-white mt-6">Connection Status</h4>
                  <div className="bg-[#0a0e1a] border border-cyan-500/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-semibold">API Connection</p>
                        <p className="text-sm text-gray-400">Last checked: 2 minutes ago</p>
                      </div>
                      <div className="flex items-center gap-2 text-green-400">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span>Connected</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Appearance */}
          <TabsContent value="appearance" className="p-6 space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Appearance</h3>
              <p className="text-gray-400 mb-6">Customize the look and feel of your dashboard</p>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="theme" className="text-gray-300">Theme</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="bg-[#0a0e1a] border-cyan-500/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f1628] border-cyan-500/30">
                      <SelectItem value="dark">Dark (Recommended)</SelectItem>
                      <SelectItem value="darker">Darker (Maximum Contrast)</SelectItem>
                      <SelectItem value="midnight">Midnight Blue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div
                    onClick={() => setTheme('dark')}
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      theme === 'dark' ? 'border-cyan-500 bg-cyan-500/10' : 'border-cyan-500/30'
                    }`}
                  >
                    <div className="aspect-video bg-[#0a0e1a] rounded mb-2"></div>
                    <p className="text-center text-white text-sm">Dark</p>
                  </div>
                  <div
                    onClick={() => setTheme('darker')}
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      theme === 'darker' ? 'border-cyan-500 bg-cyan-500/10' : 'border-cyan-500/30'
                    }`}
                  >
                    <div className="aspect-video bg-black rounded mb-2"></div>
                    <p className="text-center text-white text-sm">Darker</p>
                  </div>
                  <div
                    onClick={() => setTheme('midnight')}
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      theme === 'midnight' ? 'border-cyan-500 bg-cyan-500/10' : 'border-cyan-500/30'
                    }`}
                  >
                    <div className="aspect-video bg-blue-950 rounded mb-2"></div>
                    <p className="text-center text-white text-sm">Midnight</p>
                  </div>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Palette className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
                    <div className="text-sm text-cyan-400">
                      <p className="font-semibold mb-1">Theme Customization</p>
                      <p>Dark themes are optimized for security operations and reduce eye strain during extended monitoring sessions.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Account */}
          <TabsContent value="account" className="p-6 space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Account Settings</h3>
              <p className="text-gray-400 mb-6">Manage your account and security preferences</p>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-gray-300">Username</Label>
                    <Input
                      id="username"
                      defaultValue="admin_operator"
                      className="bg-[#0a0e1a] border-cyan-500/30 focus:border-cyan-500 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="admin@aeroguard.ai"
                      className="bg-[#0a0e1a] border-cyan-500/30 focus:border-cyan-500 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-gray-300">Role</Label>
                    <Input
                      id="role"
                      defaultValue="System Administrator"
                      disabled
                      className="bg-[#0a0e1a] border-cyan-500/30 text-gray-400"
                    />
                  </div>
                </div>

                <div className="border-t border-cyan-500/20 pt-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Change Password</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="text-gray-300">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        className="bg-[#0a0e1a] border-cyan-500/30 focus:border-cyan-500 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-gray-300">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        className="bg-[#0a0e1a] border-cyan-500/30 focus:border-cyan-500 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-gray-300">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        className="bg-[#0a0e1a] border-cyan-500/30 focus:border-cyan-500 text-white"
                      />
                    </div>
                    <Button variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
                      Update Password
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex justify-end gap-4"
      >
        <Button
          variant="outline"
          className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
        >
          Reset to Defaults
        </Button>
        <Button
          onClick={handleSave}
          className="bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/50"
        >
          <Save className="w-4 h-4 mr-2" />
          Save All Settings
        </Button>
      </motion.div>
    </div>
  );
}
