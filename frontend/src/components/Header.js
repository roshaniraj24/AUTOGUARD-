import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { 
  Bell, 
  Search, 
  Wifi, 
  WifiOff, 
  Settings, 
  LogOut, 
  UserCircle, 
  Shield, 
  Moon, 
  Sun,
  ChevronDown,
  Edit
} from 'lucide-react';
import { useWebSocket } from '../contexts/WebSocketContext';
import ProfileModal from './ProfileModal';
import SettingsModal from './SettingsModal';
import AutoGuardLogo from './Logo';

const Header = () => {
  const { isConnected, alerts, setAlerts } = useWebSocket();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [userProfile, setUserProfile] = useState({
    name: 'Admin User',
    email: 'admin@autoguard.io',
    role: 'System Administrator',
    position: 'DevOps Engineer',
    department: 'IT Operations',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Experienced DevOps engineer specializing in cloud infrastructure and automation.',
    avatar: null,
    lastLogin: new Date().toLocaleString()
  });
  
  const profileRef = useRef(null);
  const profileButtonRef = useRef(null);
  const notificationRef = useRef(null);
  const notificationButtonRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const [notificationPosition, setNotificationPosition] = useState({ top: 0, right: 0 });
  const unreadAlerts = alerts.filter(alert => !alert.read && !alert.resolved).length;

  // Calculate dropdown position
  useEffect(() => {
    if (isProfileOpen && profileButtonRef.current) {
      const rect = profileButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 10,
        right: window.innerWidth - rect.right
      });
    }
  }, [isProfileOpen]);

  // Calculate notification dropdown position
  useEffect(() => {
    if (isNotificationOpen && notificationButtonRef.current) {
      const rect = notificationButtonRef.current.getBoundingClientRect();
      setNotificationPosition({
        top: rect.bottom + 10,
        right: window.innerWidth - rect.right
      });
    }
  }, [isNotificationOpen]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target) &&
          notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsProfileOpen(false);
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    // Implement theme switching logic here
    document.documentElement.classList.toggle('light-mode');
    console.log('Theme toggled:', !isDarkMode ? 'Dark' : 'Light');
  };

  const handleLogout = () => {
    // Implement logout logic here
    if (window.confirm('Are you sure you want to logout?')) {
      console.log('Logging out...');
      // Clear user session
      localStorage.removeItem('userSession');
      localStorage.removeItem('dashboardSettings');
      // Redirect to login page or show login modal
      alert('Logged out successfully!');
      setIsProfileOpen(false);
    }
  };

  const handleEditProfile = () => {
    setIsProfileOpen(false);
    setIsProfileModalOpen(true);
  };

  const handleOpenSettings = () => {
    setIsProfileOpen(false);
    setIsSettingsModalOpen(true);
  };

  const handleUpdateProfile = (updatedProfile) => {
    setUserProfile(prev => ({
      ...prev,
      ...updatedProfile,
      lastLogin: new Date().toLocaleString()
    }));
    // Save to localStorage or send to backend
    localStorage.setItem('userProfile', JSON.stringify({
      ...userProfile,
      ...updatedProfile
    }));
    console.log('Profile updated:', updatedProfile);
  };

  const handleSecuritySettings = () => {
    setIsProfileOpen(false);
    alert('Security settings would open here - 2FA, login sessions, etc.');
  };

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsProfileOpen(false); // Close profile if open
  };

  const handleMarkAsRead = (alertId) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
  };

  const handleMarkAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      setAlerts([]);
      setIsNotificationOpen(false);
    }
  };

  const handleDeleteNotification = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return '🚨';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      case 'success':
        return '✅';
      default:
        return '📢';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'text-red-400 border-red-500/30 bg-red-500/10';
      case 'warning':
        return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
      case 'info':
        return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
      case 'success':
        return 'text-green-400 border-green-500/30 bg-green-500/10';
      default:
        return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const seconds = Math.floor((now - then) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <>
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card m-4 mb-0 px-6 py-4 flex items-center justify-between"
      >
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <AutoGuardLogo size={45} variant="default" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            AutoGuard Dashboard
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <Wifi className="w-4 h-4 text-green-400" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-400" />
          )}
          <span className={`text-xs ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="glass-button pl-10 pr-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <motion.button
            ref={notificationButtonRef}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNotificationClick}
            className="relative glass-button p-2"
          >
            <Bell className="w-5 h-5" />
            {unreadAlerts > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
              >
                {unreadAlerts > 9 ? '9+' : unreadAlerts}
              </motion.span>
            )}
          </motion.button>
        </div>

        {/* User Profile */}
        <div className="relative" ref={profileRef}>
          <motion.button
            ref={profileButtonRef}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleProfileClick}
            className="glass-button p-2 flex items-center space-x-2"
          >
            <div className="relative">
              {userProfile.avatar ? (
                <img 
                  src={userProfile.avatar} 
                  alt="Profile" 
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <UserCircle className="w-6 h-6 text-blue-400" />
              )}
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900"></div>
            </div>
            <span className="text-sm font-medium hidden md:block">{userProfile.name}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
          </motion.button>

        </div>
      </div>
    </motion.header>

    {/* Portal-based Profile Dropdown */}
    {createPortal(
      <AnimatePresence>
        {isProfileOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm"
              style={{ zIndex: 999998 }}
              onClick={() => setIsProfileOpen(false)}
            />
            
            {/* Profile dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed w-80 glass-card border border-white/20 rounded-lg shadow-2xl"
              style={{ 
                top: dropdownPosition.top,
                right: dropdownPosition.right,
                zIndex: 999999
              }}
            >
              {/* Profile Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    {userProfile.avatar ? (
                      <img 
                        src={userProfile.avatar} 
                        alt="Profile" 
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <UserCircle className="w-12 h-12 text-blue-400" />
                    )}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{userProfile.name}</h3>
                    <p className="text-sm text-gray-400">{userProfile.email}</p>
                    <p className="text-xs text-blue-400">{userProfile.role}</p>
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  Last login: {userProfile.lastLogin}
                </div>
              </div>

              {/* Profile Actions */}
              <div className="p-2">
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                  onClick={handleEditProfile}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors"
                >
                  <Edit className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">Edit Profile</span>
                </motion.button>

                <motion.button
                  whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                  onClick={handleOpenSettings}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">Settings</span>
                </motion.button>

                <motion.button
                  whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                  onClick={handleSecuritySettings}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors"
                >
                  <Shield className="w-4 h-4 text-purple-400" />
                  <span className="text-sm">Security</span>
                </motion.button>

                <motion.button
                  whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                  onClick={handleThemeToggle}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {isDarkMode ? (
                      <Moon className="w-4 h-4 text-yellow-400" />
                    ) : (
                      <Sun className="w-4 h-4 text-yellow-400" />
                    )}
                    <span className="text-sm">Theme</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {isDarkMode ? 'Dark' : 'Light'}
                  </span>
                </motion.button>

                <hr className="my-2 border-white/10" />

                <motion.button
                  whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors text-red-400"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Sign Out</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>,
      document.body
    )}

    {/* Profile Modal */}
    <ProfileModal
      isOpen={isProfileModalOpen}
      onClose={() => setIsProfileModalOpen(false)}
      userProfile={userProfile}
      onUpdateProfile={handleUpdateProfile}
    />

    {/* Settings Modal */}
    <SettingsModal
      isOpen={isSettingsModalOpen}
      onClose={() => setIsSettingsModalOpen(false)}
      isDarkMode={isDarkMode}
      onThemeToggle={handleThemeToggle}
    />

    {/* Notification Panel */}
    {createPortal(
      <AnimatePresence>
        {isNotificationOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm"
              style={{ zIndex: 999998 }}
              onClick={() => setIsNotificationOpen(false)}
            />
            
            {/* Notification dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed w-96 max-h-[600px] glass-card border border-white/20 rounded-lg shadow-2xl overflow-hidden flex flex-col"
              style={{ 
                top: notificationPosition.top,
                right: notificationPosition.right,
                zIndex: 999999
              }}
            >
              {/* Notification Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                <div>
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Notifications
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {unreadAlerts > 0 ? `${unreadAlerts} unread` : 'All caught up!'}
                  </p>
                </div>
                {alerts.length > 0 && (
                  <div className="flex items-center space-x-2">
                    {unreadAlerts > 0 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleMarkAllAsRead}
                        className="text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                      >
                        Mark all read
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleClearAll}
                      className="text-xs px-3 py-1 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                    >
                      Clear all
                    </motion.button>
                  </div>
                )}
              </div>

              {/* Notification List */}
              <div className="flex-1 overflow-y-auto">
                {alerts.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="text-6xl mb-4">🔔</div>
                    <h4 className="text-lg font-semibold text-gray-300 mb-2">No Notifications</h4>
                    <p className="text-sm text-gray-500">All systems are running smoothly</p>
                  </div>
                ) : (
                  <div className="p-2 space-y-2">
                    {alerts.map((alert, index) => (
                      <motion.div
                        key={alert.id || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-3 rounded-lg border transition-all hover:scale-[1.02] cursor-pointer ${
                          getSeverityColor(alert.severity)
                        } ${!alert.read ? 'ring-2 ring-blue-500/30' : 'opacity-70'}`}
                        onClick={() => handleMarkAsRead(alert.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <span className="text-2xl mt-1">{getSeverityIcon(alert.severity)}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className={`text-xs font-semibold uppercase tracking-wide ${
                                  alert.severity === 'critical' ? 'text-red-400' :
                                  alert.severity === 'warning' ? 'text-yellow-400' :
                                  alert.severity === 'success' ? 'text-green-400' :
                                  'text-blue-400'
                                }`}>
                                  {alert.severity}
                                </span>
                                {!alert.read && (
                                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                                )}
                                {alert.resolved && (
                                  <span className="text-xs text-green-400 flex items-center">
                                    ✓ Resolved
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-white font-medium mb-1 break-words">
                                {alert.message}
                              </p>
                              {alert.service && (
                                <p className="text-xs text-gray-400 mb-1">
                                  Service: <span className="text-blue-400">{alert.service}</span>
                                </p>
                              )}
                              <div className="flex items-center justify-between mt-2">
                                <p className="text-xs text-gray-500">
                                  {getTimeAgo(alert.timestamp || Date.now())}
                                </p>
                                {alert.autoHealed && (
                                  <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-400">
                                    Auto-healed ✨
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNotification(alert.id);
                            }}
                            className="text-gray-400 hover:text-red-400 transition-colors ml-2"
                          >
                            ×
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {alerts.length > 0 && (
                <div className="p-3 border-t border-white/10 bg-gray-900/50">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2 text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    View All Alerts →
                  </motion.button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>,
      document.body
    )}
    </>
  );
};

export default Header;