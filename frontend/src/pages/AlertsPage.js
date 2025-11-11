import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle, Clock, Zap, Filter, Search } from 'lucide-react';
import { useWebSocket } from '../contexts/WebSocketContext';
import AlertCard from '../components/AlertCard';

const AlertsPage = () => {
  const { alerts } = useWebSocket();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock alerts if WebSocket hasn't provided any
  const mockAlerts = [
    {
      id: 1,
      severity: 'critical',
      message: 'Database connection timeout on server DB-01',
      timestamp: new Date().toISOString(),
      source: 'Database Monitor',
      resolved: false
    },
    {
      id: 2,
      severity: 'warning',
      message: 'High CPU usage detected on Web Server 2 (85%)',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      source: 'System Monitor',
      resolved: false
    },
    {
      id: 3,
      severity: 'info',
      message: 'Deployment completed successfully for API v1.8.2',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      source: 'Deployment System',
      resolved: true
    }
  ];

  const allAlerts = alerts.length > 0 ? alerts : mockAlerts;

  const filteredAlerts = allAlerts.filter(alert => {
    const matchesFilter = filter === 'all' || alert.severity === filter || 
                         (filter === 'unresolved' && !alert.resolved) ||
                         (filter === 'resolved' && alert.resolved);
    const matchesSearch = alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.source?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getAlertStats = () => {
    const stats = allAlerts.reduce((acc, alert) => {
      if (!alert.resolved) {
        acc[alert.severity] = (acc[alert.severity] || 0) + 1;
        acc.total++;
      }
      return acc;
    }, { critical: 0, warning: 0, info: 0, total: 0 });
    return stats;
  };

  const stats = getAlertStats();

  const handleAutoHeal = (alertId) => {
    console.log(`Triggering auto-healing for alert ${alertId}`);
    // This would integrate with the backend API to trigger remediation
  };

  const handleResolve = (alertId) => {
    console.log(`Resolving alert ${alertId}`);
    // This would mark the alert as resolved
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-3xl font-bold">Alert Management</h1>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-button px-4 py-2 flex items-center space-x-2"
          >
            <Zap className="w-4 h-4" />
            <span>Auto-Heal All</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Alert Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="glass-card p-4 border border-red-500/30 bg-red-500/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-400 text-sm">Critical</p>
              <p className="text-2xl font-bold text-red-400">{stats.critical}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
        </div>
        <div className="glass-card p-4 border border-yellow-500/30 bg-yellow-500/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-400 text-sm">Warning</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.warning}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        <div className="glass-card p-4 border border-blue-500/30 bg-blue-500/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-400 text-sm">Info</p>
              <p className="text-2xl font-bold text-blue-400">{stats.info}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="glass-card p-4 border border-purple-500/30 bg-purple-500/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-400 text-sm">Total Active</p>
              <p className="text-2xl font-bold text-purple-400">{stats.total}</p>
            </div>
            <Clock className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card p-4"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <div className="flex space-x-2">
              {['all', 'critical', 'warning', 'info', 'unresolved', 'resolved'].map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-3 py-1 rounded-lg text-sm transition-all duration-300 ${
                    filter === filterType
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-button pl-10 pr-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>
      </motion.div>

      {/* Alert List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert, index) => (
            <motion.div
              key={alert.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <AlertCard alert={alert} />
                </div>
                <div className="flex flex-col space-y-2 ml-4">
                  {!alert.resolved && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAutoHeal(alert.id)}
                        className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 px-4 py-2 rounded-lg text-sm font-semibold flex items-center space-x-2 transition-all duration-300"
                      >
                        <Zap className="w-4 h-4" />
                        <span>Auto-Heal</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleResolve(alert.id)}
                        className="glass-button px-4 py-2 text-sm"
                      >
                        Resolve
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-12 text-center"
          >
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Alerts Found</h3>
            <p className="text-gray-400">
              {searchTerm || filter !== 'all' 
                ? 'No alerts match your current filters.' 
                : 'All systems are operating normally.'}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AlertsPage;