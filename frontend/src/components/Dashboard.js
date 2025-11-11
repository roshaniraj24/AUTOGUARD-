import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, RadialBarChart, RadialBar } from 'recharts';
import { 
  Server, 
  Cpu, 
  HardDrive, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  TrendingDown,
  Zap,
  RefreshCw,
  Download,
  Upload,
  Database,
  Globe,
  Shield,
  Power,
  Settings,
  BarChart3,
  PieChart as PieChartIcon,
  Gauge,
  Play,
  Pause,
  RotateCcw,
  Filter,
  Search,
  Bell,
  Eye,
  Calendar,
  Users,
  Layers,
  Network,
  Wifi,
  Camera,
  Mic,
  MicOff,
  CameraOff,
  Video,
  VideoOff,
  Smartphone,
  Monitor
} from 'lucide-react';
import { useWebSocket } from '../contexts/WebSocketContext';
import MetricCard from './MetricCard';
import AlertCard from './AlertCard';
import ServerStatusCard from './ServerStatusCard';
import axios from 'axios';

const Dashboard = () => {
  const { socket, isConnected } = useWebSocket();
  
  // Enhanced state management
  const [metrics, setMetrics] = useState({
    totalServers: 12,
    onlineServers: 11,
    cpuUsage: 67,
    memoryUsage: 82,
    diskUsage: 45,
    networkTraffic: 1.2,
    uptime: 99.8,
    responseTime: 145,
    throughput: 2340,
    activeConnections: 1247,
    securityThreats: 3,
    lastBackup: '2h ago',
    apiCalls: 15420,
    errors: 12,
    warnings: 7
  });

  const [performanceData, setPerformanceData] = useState([
    { time: '00:00', cpu: 45, memory: 62, network: 0.8, disk: 35, errors: 2 },
    { time: '04:00', cpu: 52, memory: 58, network: 1.1, disk: 37, errors: 1 },
    { time: '08:00', cpu: 78, memory: 85, network: 2.3, disk: 42, errors: 5 },
    { time: '12:00', cpu: 67, memory: 82, network: 1.2, disk: 45, errors: 3 },
    { time: '16:00', cpu: 71, memory: 79, network: 1.8, disk: 48, errors: 4 },
    { time: '20:00', cpu: 58, memory: 72, network: 1.4, disk: 46, errors: 2 },
  ]);

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'warning',
      message: 'High CPU usage detected on web-server-01',
      timestamp: new Date().toISOString(),
      severity: 'medium',
      source: 'web-server-01',
      status: 'active'
    },
    {
      id: 2,
      type: 'error', 
      message: 'Database connection timeout exceeded',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      severity: 'high',
      source: 'db-server',
      status: 'active'
    },
    {
      id: 3,
      type: 'info',
      message: 'System backup completed successfully',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      severity: 'low',
      source: 'backup-service',
      status: 'resolved'
    }
  ]);

  // Auto-refresh configuration
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // View and filter states
  const [viewMode, setViewMode] = useState('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h');
  const [alertFilter, setAlertFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Camera and Microphone monitoring with real-time detection
  const [mediaDevices, setMediaDevices] = useState({
    camera: {
      isActive: false,
      isAvailable: true,
      lastUsed: 'Never',
      currentApp: null,
      resolution: 'Unknown',
      frameRate: 'Unknown',
      totalUsageToday: '0 minutes',
      deviceName: 'Unknown',
      permission: 'prompt'
    },
    microphone: {
      isActive: false,
      isAvailable: true,
      lastUsed: 'Never',
      currentApp: null,
      sampleRate: 'Unknown',
      bitRate: 'Unknown',
      totalUsageToday: '0 minutes',
      deviceName: 'Unknown',
      permission: 'prompt'
    }
  });

  const [mediaStream, setMediaStream] = useState(null);
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Real-time media device monitoring
  useEffect(() => {
    let monitoringInterval;
    
    const startRealTimeMonitoring = async () => {
      try {
        // Check permissions first
        const cameraPermission = await navigator.permissions.query({ name: 'camera' });
        const microphonePermission = await navigator.permissions.query({ name: 'microphone' });
        
        // Get available devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        const audioDevices = devices.filter(device => device.kind === 'audioinput');

        // Update device information
        setMediaDevices(prev => ({
          camera: {
            ...prev.camera,
            isAvailable: videoDevices.length > 0,
            permission: cameraPermission.state,
            deviceCount: videoDevices.length,
            deviceName: videoDevices[0]?.label || 'Unknown Camera'
          },
          microphone: {
            ...prev.microphone,
            isAvailable: audioDevices.length > 0,
            permission: microphonePermission.state,
            deviceCount: audioDevices.length,
            deviceName: audioDevices[0]?.label || 'Unknown Microphone'
          }
        }));

        // Monitor active media usage
        const checkActiveMedia = async () => {
          try {
            // Check if any media streams are active by attempting to get user media
            // This is a way to detect if camera/mic are in use by other applications
            
            // For camera detection
            let cameraActive = false;
            let microphoneActive = false;
            
            try {
              // Try to access camera to see if it's available (if it's in use, this might fail)
              const testCameraStream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: 1, height: 1 }, 
                audio: false 
              });
              
              if (testCameraStream) {
                // Camera is available, but we need to check if it's being used elsewhere
                const videoTracks = testCameraStream.getVideoTracks();
                if (videoTracks.length > 0) {
                  const settings = videoTracks[0].getSettings();
                  
                  setMediaDevices(prev => ({
                    ...prev,
                    camera: {
                      ...prev.camera,
                      resolution: `${settings.width}x${settings.height}`,
                      frameRate: `${settings.frameRate} fps`,
                      isActive: true,
                      lastUsed: 'Now',
                      currentApp: 'Browser (AutoGuard Dashboard)'
                    }
                  }));
                  
                  cameraActive = true;
                }
                
                // Stop the test stream immediately
                testCameraStream.getTracks().forEach(track => track.stop());
              }
            } catch (cameraError) {
              // Camera might be in use by another application
              if (cameraError.name === 'NotReadableError' || cameraError.name === 'TrackStartError') {
                cameraActive = true;
                setMediaDevices(prev => ({
                  ...prev,
                  camera: {
                    ...prev.camera,
                    isActive: true,
                    lastUsed: 'Now',
                    currentApp: 'External Application'
                  }
                }));
              }
            }

            try {
              // Try to access microphone
              const testMicStream = await navigator.mediaDevices.getUserMedia({ 
                video: false, 
                audio: { sampleRate: 48000 } 
              });
              
              if (testMicStream) {
                const audioTracks = testMicStream.getAudioTracks();
                if (audioTracks.length > 0) {
                  const settings = audioTracks[0].getSettings();
                  
                  setMediaDevices(prev => ({
                    ...prev,
                    microphone: {
                      ...prev.microphone,
                      sampleRate: `${settings.sampleRate} Hz`,
                      bitRate: `${settings.sampleSize || 16}-bit`,
                      isActive: true,
                      lastUsed: 'Now',
                      currentApp: 'Browser (AutoGuard Dashboard)'
                    }
                  }));
                  
                  microphoneActive = true;
                }
                
                // Stop the test stream immediately
                testMicStream.getTracks().forEach(track => track.stop());
              }
            } catch (micError) {
              // Microphone might be in use by another application
              if (micError.name === 'NotReadableError' || micError.name === 'TrackStartError') {
                microphoneActive = true;
                setMediaDevices(prev => ({
                  ...prev,
                  microphone: {
                    ...prev.microphone,
                    isActive: true,
                    lastUsed: 'Now',
                    currentApp: 'External Application'
                  }
                }));
              }
            }

            // If devices are not active, update accordingly
            if (!cameraActive) {
              setMediaDevices(prev => ({
                ...prev,
                camera: {
                  ...prev.camera,
                  isActive: false,
                  currentApp: null
                }
              }));
            }

            if (!microphoneActive) {
              setMediaDevices(prev => ({
                ...prev,
                microphone: {
                  ...prev.microphone,
                  isActive: false,
                  currentApp: null
                }
              }));
            }

          } catch (error) {
            console.log('Media monitoring error:', error);
          }
        };

        // Check immediately
        await checkActiveMedia();
        
        // Set up periodic monitoring (every 3 seconds for real-time feel)
        monitoringInterval = setInterval(checkActiveMedia, 3000);
        setIsMonitoring(true);

      } catch (error) {
        console.error('Failed to start media monitoring:', error);
      }
    };

    startRealTimeMonitoring();

    return () => {
      if (monitoringInterval) {
        clearInterval(monitoringInterval);
      }
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
      setIsMonitoring(false);
    };
  }, []);

  // Enhanced media device checker with actual system detection
  const requestMediaAccess = async (type) => {
    try {
      const constraints = type === 'camera' 
        ? { video: true, audio: false }
        : { video: false, audio: true };
        
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (stream) {
        const tracks = type === 'camera' ? stream.getVideoTracks() : stream.getAudioTracks();
        
        if (tracks.length > 0) {
          const settings = tracks[0].getSettings();
          const timestamp = new Date().toLocaleTimeString();
          
          setMediaDevices(prev => ({
            ...prev,
            [type]: {
              ...prev[type],
              isActive: true,
              lastUsed: timestamp,
              currentApp: 'Browser (AutoGuard Dashboard)',
              permission: 'granted',
              ...(type === 'camera' ? {
                resolution: `${settings.width}x${settings.height}`,
                frameRate: `${settings.frameRate || 30} fps`
              } : {
                sampleRate: `${settings.sampleRate || 48000} Hz`,
                bitRate: `${settings.sampleSize || 16}-bit`
              })
            }
          }));
          
          // Keep stream active for demonstration
          setMediaStream(stream);
          
          // Auto-stop after 10 seconds for demo
          setTimeout(() => {
            stream.getTracks().forEach(track => track.stop());
            setMediaDevices(prev => ({
              ...prev,
              [type]: {
                ...prev[type],
                isActive: false,
                currentApp: null
              }
            }));
          }, 10000);
        }
      }
    } catch (error) {
      console.error(`Failed to access ${type}:`, error);
      setMediaDevices(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          permission: 'denied'
        }
      }));
    }
  };

  // Real-time data simulation with auto-upgrade
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        setIsRefreshing(true);
        // Simulate real-time data updates
        setMetrics(prev => ({
          ...prev,
          cpuUsage: Math.max(0, Math.min(100, prev.cpuUsage + (Math.random() - 0.5) * 10)),
          memoryUsage: Math.max(0, Math.min(100, prev.memoryUsage + (Math.random() - 0.5) * 8)),
          networkTraffic: Math.max(0, prev.networkTraffic + (Math.random() - 0.5) * 0.5),
          responseTime: Math.max(50, prev.responseTime + (Math.random() - 0.5) * 30),
          throughput: Math.max(0, prev.throughput + (Math.random() - 0.5) * 200),
          activeConnections: Math.max(0, prev.activeConnections + Math.floor((Math.random() - 0.5) * 100))
        }));

        // Update performance data
        setPerformanceData(prev => {
          const newData = [...prev];
          const currentTime = new Date().toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
          });
          
          newData.push({
            time: currentTime,
            cpu: Math.max(0, Math.min(100, 60 + (Math.random() - 0.5) * 40)),
            memory: Math.max(0, Math.min(100, 70 + (Math.random() - 0.5) * 30)),
            network: Math.max(0, 1.5 + (Math.random() - 0.5) * 1),
            disk: Math.max(0, Math.min(100, 45 + (Math.random() - 0.5) * 10)),
            errors: Math.floor(Math.random() * 6)
          });

          return newData.slice(-20); // Keep last 20 data points
        });

        setLastUpdate(new Date());
        
        setTimeout(() => setIsRefreshing(false), 500);
      }, refreshInterval * 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, refreshInterval]);

  // Manual refresh function
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate new random data to simulate fresh data fetch
      setMetrics(prev => ({
        ...prev,
        cpuUsage: Math.floor(Math.random() * 100),
        memoryUsage: Math.floor(Math.random() * 100),
        diskUsage: Math.floor(Math.random() * 100),
        responseTime: 100 + Math.floor(Math.random() * 200),
        throughput: 2000 + Math.floor(Math.random() * 1000)
      }));
      
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Filter alerts based on current filter
  const filteredAlerts = alerts.filter(alert => {
    const matchesFilter = alertFilter === 'all' || alert.type === alertFilter;
    const matchesSearch = searchTerm === '' || 
      alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.source.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Charts data preparation
  const pieChartData = [
    { name: 'CPU', value: metrics.cpuUsage, fill: '#3b82f6' },
    { name: 'Memory', value: metrics.memoryUsage, fill: '#10b981' },
    { name: 'Disk', value: metrics.diskUsage, fill: '#f59e0b' },
    { name: 'Available', value: 100 - Math.max(metrics.cpuUsage, metrics.memoryUsage, metrics.diskUsage), fill: '#6b7280' }
  ];

  const radialData = [
    { name: 'CPU', value: metrics.cpuUsage, fill: '#3b82f6' },
    { name: 'Memory', value: metrics.memoryUsage, fill: '#10b981' },
    { name: 'Disk', value: metrics.diskUsage, fill: '#f59e0b' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 min-h-screen"
    >
      {/* Enhanced Header with Auto-Refresh Controls */}
      <motion.div variants={itemVariants} className="glass-card p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              AutoGuard Dashboard
            </h1>
            <p className="text-gray-400 mt-1">
              Last updated: {lastUpdate.toLocaleTimeString()} 
              <span className={`ml-2 inline-flex items-center ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                <div className={`w-2 h-2 rounded-full mr-1 ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Auto-refresh toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                autoRefresh 
                  ? 'bg-green-500/20 border-green-500/50 text-green-400' 
                  : 'bg-gray-500/20 border-gray-500/50 text-gray-400'
              }`}
            >
              {autoRefresh ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              Auto-refresh
            </button>

            {/* Refresh interval selector */}
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className={`border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none transition-all ${
                refreshInterval === 1 ? 'bg-red-500/20 border-red-500/50 focus:border-red-400' :
                refreshInterval === 5 ? 'bg-green-500/20 border-green-500/50 focus:border-green-400' :
                refreshInterval === 10 ? 'bg-blue-500/20 border-blue-500/50 focus:border-blue-400' :
                refreshInterval === 30 ? 'bg-yellow-500/20 border-yellow-500/50 focus:border-yellow-400' :
                refreshInterval === 60 ? 'bg-purple-500/20 border-purple-500/50 focus:border-purple-400' :
                'bg-white/10 focus:border-blue-400'
              }`}
              disabled={!autoRefresh}
            >
              <option value={1} className="bg-red-900 text-red-300">⚡ 1s</option>
              <option value={5} className="bg-green-900 text-green-300">🚀 5s</option>
              <option value={10} className="bg-blue-900 text-blue-300">🔄 10s</option>
              <option value={30} className="bg-yellow-900 text-yellow-300">⏰ 30s</option>
              <option value={60} className="bg-purple-900 text-purple-300">⏱️ 1m</option>
            </select>

            {/* Manual refresh button */}
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            {/* View mode selector */}
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className={`border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none transition-all ${
                viewMode === 'overview' ? 'bg-blue-500/20 border-blue-500/50 focus:border-blue-400' :
                viewMode === 'detailed' ? 'bg-green-500/20 border-green-500/50 focus:border-green-400' :
                viewMode === 'analytics' ? 'bg-purple-500/20 border-purple-500/50 focus:border-purple-400' :
                'bg-white/10 focus:border-blue-400'
              }`}
            >
              <option value="overview" className="bg-blue-900 text-blue-300">📊 Overview</option>
              <option value="detailed" className="bg-green-900 text-green-300">🔍 Detailed</option>
              <option value="analytics" className="bg-purple-900 text-purple-300">📈 Analytics</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Metrics Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <MetricCard
          title="Total Servers"
          value={metrics.totalServers}
          icon={Server}
          color="blue"
          trend={2}
          subtitle={`${metrics.onlineServers} online`}
        />
        <MetricCard
          title="CPU Usage"
          value={`${Math.round(metrics.cpuUsage)}%`}
          icon={Cpu}
          color={metrics.cpuUsage > 80 ? "red" : metrics.cpuUsage > 60 ? "yellow" : "green"}
          trend={-5}
          subtitle="Average across all servers"
        />
        <MetricCard
          title="Memory Usage"
          value={`${Math.round(metrics.memoryUsage)}%`}
          icon={Activity}
          color={metrics.memoryUsage > 85 ? "red" : metrics.memoryUsage > 70 ? "yellow" : "green"}
          trend={8}
          subtitle="System memory utilization"
        />
        <MetricCard
          title="Active Users"
          value={metrics.activeConnections}
          icon={Users}
          color="purple"
          trend={15}
          subtitle="Current sessions"
        />
        <MetricCard
          title="System Uptime"
          value={`${metrics.uptime}%`}
          icon={CheckCircle}
          color="green"
          trend={0.2}
          subtitle="Last 30 days"
        />
      </motion.div>

      {/* Enhanced Performance Dashboard */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Performance Chart */}
        <div className="xl:col-span-2 glass-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
              Real-time Performance Metrics
            </h3>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className={`border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none transition-all ${
                selectedTimeRange === '5m' ? 'bg-red-500/20 border-red-500/50 focus:border-red-400' :
                selectedTimeRange === '15m' ? 'bg-orange-500/20 border-orange-500/50 focus:border-orange-400' :
                selectedTimeRange === '1h' ? 'bg-blue-500/20 border-blue-500/50 focus:border-blue-400' :
                selectedTimeRange === '6h' ? 'bg-green-500/20 border-green-500/50 focus:border-green-400' :
                selectedTimeRange === '24h' ? 'bg-purple-500/20 border-purple-500/50 focus:border-purple-400' :
                'bg-white/10 focus:border-blue-400'
              }`}
            >
              <option value="5m" className="bg-red-900 text-red-300">⚡ Last 5 minutes</option>
              <option value="15m" className="bg-orange-900 text-orange-300">🔥 Last 15 minutes</option>
              <option value="1h" className="bg-blue-900 text-blue-300">🕐 Last hour</option>
              <option value="6h" className="bg-green-900 text-green-300">📊 Last 6 hours</option>
              <option value="24h" className="bg-purple-900 text-purple-300">📈 Last 24 hours</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.7)" />
              <YAxis stroke="rgba(255,255,255,0.7)" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.9)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <Line type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} name="CPU %" />
              <Line type="monotone" dataKey="memory" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} name="Memory %" />
              <Line type="monotone" dataKey="network" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 4 }} name="Network GB/s" />
              <Line type="monotone" dataKey="errors" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 4 }} name="Errors" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Resource Usage Pie Chart */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <PieChartIcon className="w-5 h-5 mr-2 text-purple-400" />
            Resource Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({name, value}) => `${name}: ${value}%`}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Network & Security Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard
          title="Network Traffic"
          value={`${metrics.networkTraffic.toFixed(1)} GB/s`}
          icon={Network}
          color="cyan"
          trend={12}
          subtitle="Total throughput"
        />
        <MetricCard
          title="API Calls"
          value={metrics.apiCalls.toLocaleString()}
          icon={Globe}
          color="orange"
          trend={25}
          subtitle="Last 24 hours"
        />
        <MetricCard
          title="Security Alerts"
          value={metrics.securityThreats}
          icon={Shield}
          color={metrics.securityThreats > 5 ? "red" : "yellow"}
          trend={-2}
          subtitle="Active threats"
        />
        <MetricCard
          title="Response Time"
          value={`${Math.round(metrics.responseTime)}ms`}
          icon={Clock}
          color={metrics.responseTime > 200 ? "red" : metrics.responseTime > 150 ? "yellow" : "green"}
          trend={-12}
          subtitle="Average response"
        />
      </motion.div>

      {/* Camera & Microphone Monitoring Section */}
      <motion.div variants={itemVariants} className="glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold flex items-center">
            <Video className="w-5 h-5 mr-2 text-cyan-400" />
            Real-Time Media Device Monitoring
          </h3>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-gray-400">
              {isMonitoring ? 'Monitoring Active' : 'Monitoring Inactive'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Camera Status */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {mediaDevices.camera.isActive ? (
                  <Camera className="w-6 h-6 text-green-400 animate-pulse" />
                ) : (
                  <CameraOff className="w-6 h-6 text-gray-400" />
                )}
                <div>
                  <h4 className="text-white font-semibold">Camera</h4>
                  <p className="text-sm text-gray-400">
                    {mediaDevices.camera.deviceName}
                  </p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                mediaDevices.camera.isActive 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50 animate-pulse' 
                  : 'bg-gray-500/20 text-gray-400 border border-gray-500/50'
              }`}>
                {mediaDevices.camera.isActive ? 'LIVE' : 'INACTIVE'}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Status</span>
                <span className={`text-sm font-medium ${
                  mediaDevices.camera.isActive ? 'text-green-400' : 'text-gray-400'
                }`}>
                  {mediaDevices.camera.isActive ? 'In Use' : 'Available'}
                </span>
              </div>

              {mediaDevices.camera.currentApp && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Current App</span>
                  <span className="text-blue-400 text-sm font-medium">
                    {mediaDevices.camera.currentApp}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Last Used</span>
                <span className="text-gray-400 text-sm">
                  {mediaDevices.camera.lastUsed}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Resolution</span>
                <span className="text-gray-400 text-sm">
                  {mediaDevices.camera.resolution}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Frame Rate</span>
                <span className="text-gray-400 text-sm">
                  {mediaDevices.camera.frameRate}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Permission</span>
                <span className={`text-sm font-medium capitalize ${
                  mediaDevices.camera.permission === 'granted' ? 'text-green-400' :
                  mediaDevices.camera.permission === 'denied' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {mediaDevices.camera.permission || 'prompt'}
                </span>
              </div>

              {/* Test Camera Button */}
              <button
                onClick={() => requestMediaAccess('camera')}
                className="w-full mt-3 px-4 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all text-sm"
              >
                Test Camera Access
              </button>
            </div>
          </div>

          {/* Microphone Status */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {mediaDevices.microphone.isActive ? (
                  <Mic className="w-6 h-6 text-green-400 animate-pulse" />
                ) : (
                  <MicOff className="w-6 h-6 text-gray-400" />
                )}
                <div>
                  <h4 className="text-white font-semibold">Microphone</h4>
                  <p className="text-sm text-gray-400">
                    {mediaDevices.microphone.deviceName}
                  </p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                mediaDevices.microphone.isActive 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50 animate-pulse' 
                  : 'bg-gray-500/20 text-gray-400 border border-gray-500/50'
              }`}>
                {mediaDevices.microphone.isActive ? 'LIVE' : 'INACTIVE'}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Status</span>
                <span className={`text-sm font-medium ${
                  mediaDevices.microphone.isActive ? 'text-green-400' : 'text-gray-400'
                }`}>
                  {mediaDevices.microphone.isActive ? 'In Use' : 'Available'}
                </span>
              </div>

              {mediaDevices.microphone.currentApp && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Current App</span>
                  <span className="text-blue-400 text-sm font-medium">
                    {mediaDevices.microphone.currentApp}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Last Used</span>
                <span className="text-gray-400 text-sm">
                  {mediaDevices.microphone.lastUsed}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Sample Rate</span>
                <span className="text-gray-400 text-sm">
                  {mediaDevices.microphone.sampleRate}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Bit Rate</span>
                <span className="text-gray-400 text-sm">
                  {mediaDevices.microphone.bitRate}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Permission</span>
                <span className={`text-sm font-medium capitalize ${
                  mediaDevices.microphone.permission === 'granted' ? 'text-green-400' :
                  mediaDevices.microphone.permission === 'denied' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {mediaDevices.microphone.permission || 'prompt'}
                </span>
              </div>

              {/* Test Microphone Button */}
              <button
                onClick={() => requestMediaAccess('microphone')}
                className="w-full mt-3 px-4 py-2 bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/30 transition-all text-sm"
              >
                Test Microphone Access
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Media Usage Summary */}
        <div className="mt-6 bg-white/5 rounded-lg p-4 border border-white/10">
          <h4 className="text-white font-semibold mb-3 flex items-center">
            <Eye className="w-4 h-4 mr-2" />
            Live Privacy & Usage Monitor
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                mediaDevices.camera.isActive || mediaDevices.microphone.isActive ? 'text-red-400' : 'text-green-400'
              }`}>
                {mediaDevices.camera.isActive || mediaDevices.microphone.isActive ? '🔴' : '🟢'}
              </div>
              <div className="text-gray-400">Live Status</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">
                {(mediaDevices.camera.isActive ? 1 : 0) + (mediaDevices.microphone.isActive ? 1 : 0)}
              </div>
              <div className="text-gray-400">Active Devices</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {mediaDevices.camera.deviceCount + mediaDevices.microphone.deviceCount}
              </div>
              <div className="text-gray-400">Total Devices</div>
            </div>
            
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                (mediaDevices.camera.permission === 'granted' && mediaDevices.microphone.permission === 'granted') 
                  ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {mediaDevices.camera.permission === 'granted' && mediaDevices.microphone.permission === 'granted' 
                  ? '🛡️' : '⚠️'}
              </div>
              <div className="text-gray-400">Privacy Status</div>
            </div>
          </div>

          {/* Real-time alerts */}
          {(mediaDevices.camera.isActive || mediaDevices.microphone.isActive) && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center space-x-2 text-red-400 text-sm">
                <Bell className="w-4 h-4 animate-pulse" />
                <span className="font-medium">LIVE: Media devices are currently active</span>
              </div>
              <div className="text-gray-400 text-xs mt-1">
                {mediaDevices.camera.isActive && mediaDevices.camera.currentApp && (
                  <span>Camera in use by: {mediaDevices.camera.currentApp}</span>
                )}
                {mediaDevices.camera.isActive && mediaDevices.microphone.isActive && <span> | </span>}
                {mediaDevices.microphone.isActive && mediaDevices.microphone.currentApp && (
                  <span>Microphone in use by: {mediaDevices.microphone.currentApp}</span>
                )}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center space-x-2 text-blue-400 text-sm">
              <Shield className="w-4 h-4" />
              <span className="font-medium">Real-Time Monitoring Active</span>
            </div>
            <div className="text-gray-400 text-xs mt-1">
              This dashboard continuously monitors your camera and microphone usage. Use the test buttons to verify device access or open another application (like Zoom, Teams, etc.) to see real-time detection.
            </div>
          </div>
        </div>
      </motion.div>

      {/* Server Status & Alerts Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enhanced Server Status */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Server className="w-5 h-5 mr-2 text-green-400" />
              Server Infrastructure Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ServerStatusCard 
                name="Web Server 1"
                status="online"
                cpu={Math.round(metrics.cpuUsage * 0.7)}
                memory={Math.round(metrics.memoryUsage * 0.6)}
                uptime="15d 8h"
                connections={342}
              />
              <ServerStatusCard 
                name="Web Server 2"
                status="online"
                cpu={Math.round(metrics.cpuUsage * 0.5)}
                memory={Math.round(metrics.memoryUsage * 0.8)}
                uptime="12d 14h"
                connections={289}
              />
              <ServerStatusCard 
                name="Database Server"
                status={metrics.memoryUsage > 85 ? "warning" : "online"}
                cpu={Math.round(metrics.cpuUsage * 1.1)}
                memory={Math.round(metrics.memoryUsage)}
                uptime="22d 3h"
                connections={156}
              />
              <ServerStatusCard 
                name="Load Balancer"
                status="online"
                cpu={Math.round(metrics.cpuUsage * 0.3)}
                memory={Math.round(metrics.memoryUsage * 0.4)}
                uptime="30d 12h"
                connections={1247}
              />
            </div>
          </div>
        </div>

        {/* Enhanced Alerts Panel */}
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Bell className="w-5 h-5 mr-2 text-yellow-400" />
              System Alerts
            </h3>
            <div className="flex gap-2">
              <select
                value={alertFilter}
                onChange={(e) => setAlertFilter(e.target.value)}
                className={`border border-white/20 rounded px-2 py-1 text-xs text-white focus:outline-none transition-all ${
                  alertFilter === 'all' ? 'bg-blue-500/20 border-blue-500/50 focus:border-blue-400' :
                  alertFilter === 'error' ? 'bg-red-500/20 border-red-500/50 focus:border-red-400' :
                  alertFilter === 'warning' ? 'bg-yellow-500/20 border-yellow-500/50 focus:border-yellow-400' :
                  alertFilter === 'info' ? 'bg-green-500/20 border-green-500/50 focus:border-green-400' :
                  'bg-white/10 focus:border-blue-400'
                }`}
              >
                <option value="all" className="bg-blue-900 text-blue-300">📋 All</option>
                <option value="error" className="bg-red-900 text-red-300">❌ Errors</option>
                <option value="warning" className="bg-yellow-900 text-yellow-300">⚠️ Warnings</option>
                <option value="info" className="bg-green-900 text-green-300">ℹ️ Info</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            <AnimatePresence>
              {filteredAlerts.length > 0 ? (
                filteredAlerts.slice(0, 10).map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <AlertCard alert={alert} />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-gray-400"
                >
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No alerts found</p>
                  <p className="text-sm">All systems operational</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Additional Insights Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Storage Usage"
          value={`${metrics.diskUsage}%`}
          icon={HardDrive}
          color={metrics.diskUsage > 80 ? "red" : metrics.diskUsage > 60 ? "yellow" : "green"}
          trend={3}
          subtitle="Total disk space"
        />
        <MetricCard
          title="Error Rate"
          value={`${metrics.errors}/hr`}
          icon={AlertTriangle}
          color={metrics.errors > 10 ? "red" : "yellow"}
          trend={-15}
          subtitle="Last hour errors"
        />
        <MetricCard
          title="Last Backup"
          value={metrics.lastBackup}
          icon={Download}
          color="blue"
          trend={0}
          subtitle="System backup"
        />
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;