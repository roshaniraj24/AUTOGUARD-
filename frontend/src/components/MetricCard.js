import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const MetricCard = ({ title, value, icon: Icon, color, trend, subtitle, className = '' }) => {
  const getColorClasses = (color) => {
    switch (color) {
      case 'green':
        return 'text-green-400 border-green-500/30 bg-green-500/10';
      case 'red':
        return 'text-red-400 border-red-500/30 bg-red-500/10';
      case 'yellow':
        return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
      case 'blue':
        return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
      case 'purple':
        return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
      case 'cyan':
        return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
      case 'orange':
        return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
      default:
        return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
    }
  };

  const colorClasses = getColorClasses(color);

  const getTrendIcon = () => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getTrendColor = () => {
    if (trend > 0) return 'text-green-400';
    if (trend < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  return (
    <motion.div
      whileHover={{ 
        scale: 1.02, 
        y: -2,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}
      transition={{ duration: 0.2 }}
      className={`metric-card relative overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses} relative z-10`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center text-sm ${getTrendColor()} relative z-10`}>
            {getTrendIcon()}
            <span className="ml-1 font-medium">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      
      <div className="relative z-10">
        <h3 className="text-2xl font-bold mb-1 text-white">{value}</h3>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>

      {/* Animated background gradient */}
      <motion.div 
        className={`absolute inset-0 opacity-5 bg-gradient-to-br ${
          color === 'blue' ? 'from-blue-400 to-blue-600' :
          color === 'green' ? 'from-green-400 to-green-600' :
          color === 'red' ? 'from-red-400 to-red-600' :
          color === 'yellow' ? 'from-yellow-400 to-yellow-600' :
          color === 'purple' ? 'from-purple-400 to-purple-600' :
          color === 'cyan' ? 'from-cyan-400 to-cyan-600' :
          color === 'orange' ? 'from-orange-400 to-orange-600' :
          'from-blue-400 to-blue-600'
        }`}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />
      
      {/* Glow effect on hover */}
      <motion.div 
        className={`absolute inset-0 opacity-0 bg-gradient-to-r ${
          color === 'blue' ? 'from-blue-400/20 to-transparent' :
          color === 'green' ? 'from-green-400/20 to-transparent' :
          color === 'red' ? 'from-red-400/20 to-transparent' :
          color === 'yellow' ? 'from-yellow-400/20 to-transparent' :
          color === 'purple' ? 'from-purple-400/20 to-transparent' :
          color === 'cyan' ? 'from-cyan-400/20 to-transparent' :
          color === 'orange' ? 'from-orange-400/20 to-transparent' :
          'from-blue-400/20 to-transparent'
        }`}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default MetricCard;