import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import toast from 'react-hot-toast';

const WebSocketContext = createContext();

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [metrics, setMetrics] = useState({});
  const [alerts, setAlerts] = useState([
    // Sample alerts for demonstration
    {
      id: 1,
      message: 'Web Server 1 CPU usage at 95% - Auto-healing initiated',
      severity: 'critical',
      service: 'webserver1',
      timestamp: Date.now() - 120000, // 2 minutes ago
      read: false,
      resolved: false,
      autoHealed: true
    },
    {
      id: 2,
      message: 'PostgreSQL database backup completed successfully',
      severity: 'success',
      service: 'postgres',
      timestamp: Date.now() - 300000, // 5 minutes ago
      read: false,
      resolved: true,
      autoHealed: false
    },
    {
      id: 3,
      message: 'Redis cache memory usage at 80% - Consider scaling',
      severity: 'warning',
      service: 'redis',
      timestamp: Date.now() - 600000, // 10 minutes ago
      read: false,
      resolved: false,
      autoHealed: false
    },
    {
      id: 4,
      message: 'Nginx reverse proxy configuration updated',
      severity: 'info',
      service: 'nginx',
      timestamp: Date.now() - 900000, // 15 minutes ago
      read: true,
      resolved: true,
      autoHealed: false
    },
    {
      id: 5,
      message: 'Prometheus metrics collector restarted - Service restored',
      severity: 'warning',
      service: 'prometheus',
      timestamp: Date.now() - 1800000, // 30 minutes ago
      read: false,
      resolved: true,
      autoHealed: true
    },
    {
      id: 6,
      message: 'Disk space on backend server at 85% - Cleanup required',
      severity: 'warning',
      service: 'backend',
      timestamp: Date.now() - 3600000, // 1 hour ago
      read: true,
      resolved: false,
      autoHealed: false
    },
    {
      id: 7,
      message: 'Grafana dashboard access spike detected - Performance normal',
      severity: 'info',
      service: 'grafana',
      timestamp: Date.now() - 7200000, // 2 hours ago
      read: true,
      resolved: true,
      autoHealed: false
    },
    {
      id: 8,
      message: 'Nagios monitoring service updated to latest version',
      severity: 'success',
      service: 'nagios',
      timestamp: Date.now() - 10800000, // 3 hours ago
      read: true,
      resolved: true,
      autoHealed: false
    },
    {
      id: 9,
      message: 'Database connection pool exhausted - Auto-healing applied',
      severity: 'critical',
      service: 'backend',
      timestamp: Date.now() - 14400000, // 4 hours ago
      read: false,
      resolved: true,
      autoHealed: true
    }
  ]);

  useEffect(() => {
    const socketUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:5000';
    const newSocket = io(socketUrl);

    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      toast.success('Connected to monitoring system');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      toast.error('Disconnected from monitoring system');
    });

    newSocket.on('metrics_update', (data) => {
      setMetrics(data);
    });

    newSocket.on('new_alert', (alert) => {
      setAlerts(prev => [alert, ...prev.slice(0, 99)]); // Keep last 100 alerts
      
      const toastOptions = {
        duration: 6000,
        style: {
          background: alert.severity === 'critical' ? 'rgba(239, 68, 68, 0.1)' : 
                     alert.severity === 'warning' ? 'rgba(245, 158, 11, 0.1)' : 
                     'rgba(59, 130, 246, 0.1)',
          borderColor: alert.severity === 'critical' ? 'rgba(239, 68, 68, 0.5)' : 
                      alert.severity === 'warning' ? 'rgba(245, 158, 11, 0.5)' : 
                      'rgba(59, 130, 246, 0.5)',
        }
      };

      if (alert.severity === 'critical') {
        toast.error(`🚨 ${alert.message}`, toastOptions);
      } else if (alert.severity === 'warning') {
        toast(`⚠️ ${alert.message}`, toastOptions);
      } else {
        toast(`ℹ️ ${alert.message}`, toastOptions);
      }
    });

    newSocket.on('alert_resolved', (alertId) => {
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, resolved: true } : alert
      ));
      toast.success('Alert resolved automatically');
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const value = {
    socket,
    isConnected,
    metrics,
    alerts,
    setAlerts
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};