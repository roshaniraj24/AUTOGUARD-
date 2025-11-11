import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { 
  X, 
  Settings, 
  Monitor, 
  Bell, 
  Palette,
  Globe,
  Shield,
  Database,
  Zap,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Smartphone,
  Mail,
  Check
} from 'lucide-react';

const SettingsModal = ({ isOpen, onClose, isDarkMode, onThemeToggle }) => {
  const [settings, setSettings] = useState({
    theme: isDarkMode ? 'dark' : 'light',
    notifications: {
      email: true,
      push: true,
      sms: false,
      sound: true
    },
    dashboard: {
      autoRefresh: true,
      refreshInterval: 5,
      animations: true,
      compactMode: false
    },
    privacy: {
      profileVisibility: 'team',
      activityTracking: true,
      dataCollection: false
    }
  });

  const [saved, setSaved] = useState(false);

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleThemeChange = (theme) => {
    setSettings(prev => ({ ...prev, theme }));
    if (theme === 'dark' && !isDarkMode) {
      onThemeToggle();
    } else if (theme === 'light' && isDarkMode) {
      onThemeToggle();
    }
  };

  const handleSaveSettings = () => {
    // Simulate saving settings
    localStorage.setItem('dashboardSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99999] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="glass-card w-full max-w-3xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Settings className="w-6 h-6 mr-3" />
              Settings
            </h2>
            <button
              onClick={onClose}
              className="glass-button p-2 hover:bg-red-500/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[70vh] space-y-8">
            {/* Theme Settings */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Appearance
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    settings.theme === 'dark' 
                      ? 'border-blue-500 bg-blue-500/20' 
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <Moon className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                  <div className="text-white font-medium">Dark Mode</div>
                  <div className="text-gray-400 text-sm">Easy on the eyes</div>
                </button>
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    settings.theme === 'light' 
                      ? 'border-yellow-500 bg-yellow-500/20' 
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <Sun className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                  <div className="text-white font-medium">Light Mode</div>
                  <div className="text-gray-400 text-sm">Bright and clear</div>
                </button>
              </div>
            </div>

            {/* Notification Settings */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notifications
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="text-white font-medium">Email Notifications</div>
                      <div className="text-gray-400 text-sm">Receive alerts via email</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSettingChange('notifications', 'email', !settings.notifications.email)}
                    className={`w-12 h-6 rounded-full transition-all ${
                      settings.notifications.email ? 'bg-blue-500' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-all ${
                      settings.notifications.email ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-5 h-5 text-green-400" />
                    <div>
                      <div className="text-white font-medium">Push Notifications</div>
                      <div className="text-gray-400 text-sm">Browser push notifications</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSettingChange('notifications', 'push', !settings.notifications.push)}
                    className={`w-12 h-6 rounded-full transition-all ${
                      settings.notifications.push ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-all ${
                      settings.notifications.push ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {settings.notifications.sound ? (
                      <Volume2 className="w-5 h-5 text-purple-400" />
                    ) : (
                      <VolumeX className="w-5 h-5 text-gray-400" />
                    )}
                    <div>
                      <div className="text-white font-medium">Sound Alerts</div>
                      <div className="text-gray-400 text-sm">Play sound for notifications</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSettingChange('notifications', 'sound', !settings.notifications.sound)}
                    className={`w-12 h-6 rounded-full transition-all ${
                      settings.notifications.sound ? 'bg-purple-500' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-all ${
                      settings.notifications.sound ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Dashboard Settings */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Monitor className="w-5 h-5 mr-2" />
                Dashboard
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <div>
                      <div className="text-white font-medium">Auto Refresh</div>
                      <div className="text-gray-400 text-sm">Automatically update dashboard data</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSettingChange('dashboard', 'autoRefresh', !settings.dashboard.autoRefresh)}
                    className={`w-12 h-6 rounded-full transition-all ${
                      settings.dashboard.autoRefresh ? 'bg-yellow-500' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-all ${
                      settings.dashboard.autoRefresh ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-white font-medium">Refresh Interval</div>
                    <div className="text-blue-400 font-mono">{settings.dashboard.refreshInterval}s</div>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="60"
                    value={settings.dashboard.refreshInterval}
                    onChange={(e) => handleSettingChange('dashboard', 'refreshInterval', parseInt(e.target.value))}
                    className="w-full accent-blue-500"
                    disabled={!settings.dashboard.autoRefresh}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1s</span>
                    <span>60s</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-cyan-400" />
                    <div>
                      <div className="text-white font-medium">Animations</div>
                      <div className="text-gray-400 text-sm">Enable smooth transitions and animations</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSettingChange('dashboard', 'animations', !settings.dashboard.animations)}
                    className={`w-12 h-6 rounded-full transition-all ${
                      settings.dashboard.animations ? 'bg-cyan-500' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-all ${
                      settings.dashboard.animations ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Privacy & Security
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="text-white font-medium mb-3">Profile Visibility</div>
                  <div className="space-y-2">
                    {['public', 'team', 'private'].map((option) => (
                      <label key={option} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="profileVisibility"
                          value={option}
                          checked={settings.privacy.profileVisibility === option}
                          onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                          className="accent-blue-500"
                        />
                        <div>
                          <div className="text-white capitalize">{option}</div>
                          <div className="text-gray-400 text-sm">
                            {option === 'public' && 'Visible to everyone'}
                            {option === 'team' && 'Visible to team members only'}
                            {option === 'private' && 'Only visible to you'}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Database className="w-5 h-5 text-orange-400" />
                    <div>
                      <div className="text-white font-medium">Activity Tracking</div>
                      <div className="text-gray-400 text-sm">Track your dashboard usage for analytics</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSettingChange('privacy', 'activityTracking', !settings.privacy.activityTracking)}
                    className={`w-12 h-6 rounded-full transition-all ${
                      settings.privacy.activityTracking ? 'bg-orange-500' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-all ${
                      settings.privacy.activityTracking ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-white/10">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500/20 border border-gray-500/50 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveSettings}
              disabled={saved}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all disabled:opacity-50"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved!
                </>
              ) : (
                'Save Settings'
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default SettingsModal;