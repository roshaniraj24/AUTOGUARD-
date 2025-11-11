import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Server, Play, Square, RotateCcw, Settings, Eye } from 'lucide-react';
import ServerStatusCard from '../components/ServerStatusCard';

const ServersPage = () => {
  const [servers] = useState([
    { id: 1, name: 'Web Server 1', status: 'online', cpu: 45, memory: 62, uptime: '15d 8h', ip: '172.20.0.10' },
    { id: 2, name: 'Web Server 2', status: 'online', cpu: 38, memory: 55, uptime: '12d 14h', ip: '172.20.0.11' },
    { id: 3, name: 'Database Server', status: 'warning', cpu: 78, memory: 89, uptime: '22d 3h', ip: '172.20.0.12' },
    { id: 4, name: 'Load Balancer', status: 'online', cpu: 23, memory: 41, uptime: '30d 12h', ip: '172.20.0.13' },
    { id: 5, name: 'Redis Cache', status: 'online', cpu: 15, memory: 28, uptime: '18d 6h', ip: '172.20.0.14' },
    { id: 6, name: 'Monitoring Server', status: 'online', cpu: 32, memory: 46, uptime: '25d 11h', ip: '172.20.0.15' },
  ]);

  const handleServerAction = (serverId, action) => {
    console.log(`${action} server ${serverId}`);
    // This would integrate with the backend API
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-3xl font-bold">Server Management</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="glass-button px-4 py-2 flex items-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Refresh All</span>
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servers.map((server, index) => (
          <motion.div
            key={server.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Server className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold">{server.name}</h3>
              </div>
              <div className={`w-3 h-3 rounded-full ${
                server.status === 'online' ? 'bg-green-500' :
                server.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
            </div>

            <div className="mb-4 text-sm text-gray-400">
              <p>IP: {server.ip}</p>
              <p>Uptime: {server.uptime}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
              <div className="bg-black/20 rounded p-2">
                <div className="text-gray-400">CPU</div>
                <div className={`font-semibold ${
                  server.cpu > 80 ? 'text-red-400' : 
                  server.cpu > 60 ? 'text-yellow-400' : 'text-green-400'
                }`}>{server.cpu}%</div>
              </div>
              <div className="bg-black/20 rounded p-2">
                <div className="text-gray-400">Memory</div>
                <div className={`font-semibold ${
                  server.memory > 85 ? 'text-red-400' : 
                  server.memory > 70 ? 'text-yellow-400' : 'text-green-400'
                }`}>{server.memory}%</div>
              </div>
            </div>

            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleServerAction(server.id, 'start')}
                className="flex-1 glass-button px-3 py-2 text-xs flex items-center justify-center space-x-1"
              >
                <Play className="w-3 h-3" />
                <span>Start</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleServerAction(server.id, 'stop')}
                className="flex-1 glass-button px-3 py-2 text-xs flex items-center justify-center space-x-1"
              >
                <Square className="w-3 h-3" />
                <span>Stop</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleServerAction(server.id, 'restart')}
                className="flex-1 glass-button px-3 py-2 text-xs flex items-center justify-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Restart</span>
              </motion.button>
            </div>

            <div className="flex space-x-2 mt-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 glass-button px-3 py-2 text-xs flex items-center justify-center space-x-1"
              >
                <Eye className="w-3 h-3" />
                <span>Monitor</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 glass-button px-3 py-2 text-xs flex items-center justify-center space-x-1"
              >
                <Settings className="w-3 h-3" />
                <span>Configure</span>
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ServersPage;