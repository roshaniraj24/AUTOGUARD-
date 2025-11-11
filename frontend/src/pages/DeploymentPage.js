import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Play, GitBranch, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const DeploymentPage = () => {
  const [deployments] = useState([
    {
      id: 1,
      name: 'Web Application v2.1.0',
      status: 'success',
      environment: 'production',
      branch: 'main',
      commit: 'a1b2c3d',
      timestamp: '2024-11-07T10:30:00Z',
      duration: '3m 45s'
    },
    {
      id: 2,
      name: 'API Service v1.8.2',
      status: 'running',
      environment: 'staging',
      branch: 'develop',
      commit: 'e4f5g6h',
      timestamp: '2024-11-07T11:15:00Z',
      duration: '2m 12s'
    },
    {
      id: 3,
      name: 'Database Migration',
      status: 'failed',
      environment: 'production',
      branch: 'hotfix/db-patch',
      commit: 'i7j8k9l',
      timestamp: '2024-11-07T09:45:00Z',
      duration: '1m 23s'
    }
  ]);

  const [activeTab, setActiveTab] = useState('deployments');

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'running':
        return <Play className="w-5 h-5 text-blue-400" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'border-green-500/50 bg-green-500/10';
      case 'running':
        return 'border-blue-500/50 bg-blue-500/10';
      case 'failed':
        return 'border-red-500/50 bg-red-500/10';
      default:
        return 'border-yellow-500/50 bg-yellow-500/10';
    }
  };

  const handleDeploy = () => {
    console.log('Starting new deployment...');
    // This would integrate with the backend API
  };

  const handleRollback = (deploymentId) => {
    console.log(`Rolling back deployment ${deploymentId}`);
    // This would integrate with the backend API
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-3xl font-bold">Deployment Management</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDeploy}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all duration-300"
        >
          <Rocket className="w-5 h-5" />
          <span>New Deployment</span>
        </motion.button>
      </motion.div>

      {/* Tabs */}
      <div className="glass-card p-1">
        <div className="flex space-x-1">
          {['deployments', 'pipelines', 'environments'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Deployment History */}
      {activeTab === 'deployments' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {deployments.map((deployment, index) => (
            <motion.div
              key={deployment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-card p-6 border ${getStatusColor(deployment.status)}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(deployment.status)}
                  <div>
                    <h3 className="font-semibold">{deployment.name}</h3>
                    <p className="text-sm text-gray-400">{deployment.environment}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">{deployment.duration}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-black/20 rounded p-3">
                  <div className="text-xs text-gray-400 mb-1">Branch</div>
                  <div className="flex items-center space-x-1">
                    <GitBranch className="w-3 h-3 text-green-400" />
                    <span className="text-sm">{deployment.branch}</span>
                  </div>
                </div>
                <div className="bg-black/20 rounded p-3">
                  <div className="text-xs text-gray-400 mb-1">Commit</div>
                  <span className="text-sm font-mono">{deployment.commit}</span>
                </div>
                <div className="bg-black/20 rounded p-3">
                  <div className="text-xs text-gray-400 mb-1">Deployed</div>
                  <span className="text-sm">{new Date(deployment.timestamp).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-button px-4 py-2 text-sm"
                >
                  View Logs
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleRollback(deployment.id)}
                  className="glass-button px-4 py-2 text-sm"
                >
                  Rollback
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-button px-4 py-2 text-sm"
                >
                  Redeploy
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pipelines */}
      {activeTab === 'pipelines' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-6"
        >
          <h3 className="text-xl font-semibold mb-4">CI/CD Pipelines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['Build Pipeline', 'Test Pipeline', 'Deploy Pipeline'].map((pipeline, index) => (
              <motion.div
                key={pipeline}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-black/20 rounded-lg p-4"
              >
                <h4 className="font-medium mb-2">{pipeline}</h4>
                <div className="text-sm text-gray-400 mb-3">Last run: 2 hours ago</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400">Success</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="glass-button px-3 py-1 text-xs"
                  >
                    Run
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Environments */}
      {activeTab === 'environments' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {['Production', 'Staging', 'Development'].map((env, index) => (
            <motion.div
              key={env}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">{env}</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-400">Healthy</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-black/20 rounded p-3">
                  <div className="text-xs text-gray-400">Version</div>
                  <div className="font-semibold">v2.1.0</div>
                </div>
                <div className="bg-black/20 rounded p-3">
                  <div className="text-xs text-gray-400">Instances</div>
                  <div className="font-semibold">3</div>
                </div>
                <div className="bg-black/20 rounded p-3">
                  <div className="text-xs text-gray-400">CPU</div>
                  <div className="font-semibold text-green-400">45%</div>
                </div>
                <div className="bg-black/20 rounded p-3">
                  <div className="text-xs text-gray-400">Memory</div>
                  <div className="font-semibold text-yellow-400">72%</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default DeploymentPage;