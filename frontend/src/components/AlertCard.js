import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Info, 
  XCircle, 
  Clock, 
  CheckCircle, 
  X, 
  ExternalLink, 
  Eye,
  MoreHorizontal,
  AlertCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const AlertCard = ({ alert, onResolve, onDismiss, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const getSeverityIcon = (type, severity) => {
    if (type === 'error' || severity === 'critical' || severity === 'high') return XCircle;
    if (type === 'warning' || severity === 'medium') return AlertTriangle;
    if (type === 'info' || severity === 'low') return Info;
    return AlertCircle;
  };

  const getSeverityClasses = (type, severity, status) => {
    const baseClasses = 'border-l-4';
    
    if (status === 'resolved') {
      return `${baseClasses} border-green-500/50 bg-green-500/10 text-green-400`;
    }
    
    if (type === 'error' || severity === 'critical' || severity === 'high') {
      return `${baseClasses} border-red-500/50 bg-red-500/10 text-red-400`;
    }
    if (type === 'warning' || severity === 'medium') {
      return `${baseClasses} border-yellow-500/50 bg-yellow-500/10 text-yellow-400`;
    }
    if (type === 'info' || severity === 'low') {
      return `${baseClasses} border-blue-500/50 bg-blue-500/10 text-blue-400`;
    }
    return `${baseClasses} border-gray-500/50 bg-gray-500/10 text-gray-400`;
  };

  const getSeverityLabel = (type, severity) => {
    if (type === 'error' || severity === 'critical' || severity === 'high') return 'Critical';
    if (type === 'warning' || severity === 'medium') return 'Warning';
    if (type === 'info' || severity === 'low') return 'Info';
    return 'Unknown';
  };

  const Icon = getSeverityIcon(alert.type, alert.severity);
  const severityClasses = getSeverityClasses(alert.type, alert.severity, alert.status);
  const severityLabel = getSeverityLabel(alert.type, alert.severity);
  const timeAgo = alert.timestamp ? formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true }) : 'Unknown time';

  const handleResolve = () => {
    if (onResolve) {
      onResolve(alert.id);
    }
  };

  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss(alert.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
      className={`glass-card p-4 ${severityClasses} ${alert.status === 'resolved' ? 'opacity-75' : ''} ${className} relative overflow-hidden`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="relative">
            <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
            {alert.status === 'active' && (
              <motion.div
                className="absolute -top-1 -right-1 w-2 h-2 bg-current rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                alert.status === 'resolved' ? 'bg-green-500/20 text-green-400' :
                alert.type === 'error' ? 'bg-red-500/20 text-red-400' :
                alert.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-blue-500/20 text-blue-400'
              }`}>
                {severityLabel}
              </span>
              {alert.source && (
                <span className="text-xs text-gray-400 truncate">
                  {alert.source}
                </span>
              )}
            </div>
            
            <p className="text-sm font-medium text-white leading-relaxed">
              {alert.message || 'No message provided'}
            </p>
            
            <div className="flex items-center space-x-2 mt-2 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              <span>{timeAgo}</span>
              {alert.status === 'resolved' && (
                <>
                  <span>•</span>
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span className="text-green-400">Resolved</span>
                </>
              )}
            </div>

            {/* Expanded details */}
            <AnimatePresence>
              {isExpanded && alert.details && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 pt-3 border-t border-gray-600/30"
                >
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {alert.details}
                  </p>
                  {alert.recommendedAction && (
                    <div className="mt-2">
                      <p className="text-xs text-blue-400 font-medium">Recommended Action:</p>
                      <p className="text-xs text-gray-300">{alert.recommendedAction}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Action buttons */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center space-x-1 ml-2"
            >
              {alert.details && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                  title={isExpanded ? "Collapse details" : "Expand details"}
                >
                  <Eye className="w-3 h-3" />
                </motion.button>
              )}
              
              {alert.status !== 'resolved' && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleResolve}
                  className="p-1 text-gray-400 hover:text-green-400 transition-colors"
                  title="Mark as resolved"
                >
                  <CheckCircle className="w-3 h-3" />
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDismiss}
                className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                title="Dismiss alert"
              >
                <X className="w-3 h-3" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Priority indicator */}
      <motion.div
        className={`absolute top-0 left-0 w-1 h-full ${
          alert.type === 'error' ? 'bg-red-400' :
          alert.type === 'warning' ? 'bg-yellow-400' :
          'bg-blue-400'
        }`}
        animate={{
          opacity: alert.status === 'active' ? [0.5, 1, 0.5] : 0.5
        }}
        transition={{
          duration: 2,
          repeat: alert.status === 'active' ? Infinity : 0,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
};

export default AlertCard;