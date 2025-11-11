import React from 'react';
import { motion } from 'framer-motion';
import { Server, Cpu, HardDrive, Clock, Circle, Activity, Wifi, AlertTriangle, Settings, Power } from 'lucide-react';

const ServerStatusCard = ({ name, status, cpu, memory, uptime, connections, className = '' }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'offline':
        return 'text-red-400';
      case 'maintenance':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'warning':
        return 'Warning';
      case 'offline':
        return 'Offline';
      case 'maintenance':
        return 'Maintenance';
      default:
        return 'Unknown';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online':
        return <Circle className="w-2 h-2 fill-current animate-pulse" />;
      case 'warning':
        return <AlertTriangle className="w-3 h-3" />;
      case 'offline':
        return <Circle className="w-2 h-2 fill-current" />;
      case 'maintenance':
        return <Settings className="w-3 h-3 animate-spin" />;
      default:
        return <Circle className="w-2 h-2 fill-current" />;
    }
  };

  const statusColor = getStatusColor(status);

  const getMetricColor = (value, type) => {
    if (type === 'cpu') {
      return value > 80 ? 'text-red-400' : value > 60 ? 'text-yellow-400' : 'text-green-400';
    }
    if (type === 'memory') {
      return value > 85 ? 'text-red-400' : value > 70 ? 'text-yellow-400' : 'text-green-400';
    }
    return 'text-blue-400';
  };

  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
      }}
      transition={{ duration: 0.2 }}
      className={`glass-card p-4 relative overflow-hidden border-l-4 ${
        status === 'online' ? 'border-green-500/50' :
        status === 'warning' ? 'border-yellow-500/50' :
        status === 'offline' ? 'border-red-500/50' :
        'border-blue-500/50'
      } ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-lg ${
            status === 'online' ? 'bg-green-500/20' :
            status === 'warning' ? 'bg-yellow-500/20' :
            status === 'offline' ? 'bg-red-500/20' :
            'bg-blue-500/20'
          }`}>
            <Server className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <span className="font-medium text-sm text-white">{name}</span>
            {connections && (
              <p className="text-xs text-gray-400">{connections} connections</p>
            )}
          </div>
        </div>
        <div className={`flex items-center space-x-1 ${statusColor}`}>
          {getStatusIcon(status)}
          <span className="text-xs font-medium">{getStatusText(status)}</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Cpu className="w-3 h-3 text-gray-400" />
            <span className="text-gray-400">CPU Usage</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={getMetricColor(cpu, 'cpu')}>
              {cpu}%
            </span>
            <div className="w-12 h-1 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${
                  cpu > 80 ? 'bg-red-400' : cpu > 60 ? 'bg-yellow-400' : 'bg-green-400'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${cpu}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Activity className="w-3 h-3 text-gray-400" />
            <span className="text-gray-400">Memory</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={getMetricColor(memory, 'memory')}>
              {memory}%
            </span>
            <div className="w-12 h-1 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${
                  memory > 85 ? 'bg-red-400' : memory > 70 ? 'bg-yellow-400' : 'bg-green-400'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${memory}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="text-gray-400">Uptime</span>
          </div>
          <span className="text-blue-400 font-medium">{uptime}</span>
        </div>

        {connections && (
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <Wifi className="w-3 h-3 text-gray-400" />
              <span className="text-gray-400">Connections</span>
            </div>
            <span className="text-purple-400 font-medium">{connections}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end mt-4 space-x-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
          title="Server Settings"
        >
          <Settings className="w-3 h-3" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-1 text-gray-400 hover:text-red-400 transition-colors"
          title="Power Options"
        >
          <Power className="w-3 h-3" />
        </motion.button>
      </div>

      {/* Status glow effect */}
      <motion.div
        className={`absolute inset-0 opacity-5 ${
          status === 'online' ? 'bg-green-400' :
          status === 'warning' ? 'bg-yellow-400' :
          status === 'offline' ? 'bg-red-400' :
          'bg-blue-400'
        }`}
        animate={{
          opacity: status === 'online' ? [0.05, 0.1, 0.05] : 0.05
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
};

export default ServerStatusCard;