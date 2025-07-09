import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaWifi, FaWifiOff, FaBell, FaChartLine, FaServer } from 'react-icons/fa';
import websocketService from '../../services/websocketService';

const RealTimeStatus = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const connectWebSocket = async () => {
      try {
        await websocketService.connect(token);
        setIsConnected(true);
        
        // Subscribe to various message types
        websocketService.subscribe('notification', handleMessage);
        websocketService.subscribe('analytics_update', handleMessage);
        websocketService.subscribe('system_alert', handleMessage);
        websocketService.subscribe('user_activity', handleMessage);
        
        // Request initial data
        websocketService.requestAnalytics('30d');
        websocketService.requestSystemStatus();
      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
        setIsConnected(false);
      }
    };

    connectWebSocket();

    return () => {
      websocketService.disconnect();
    };
  }, []);

  const handleMessage = (data) => {
    setLastMessage(data);
    setMessageCount(prev => prev + 1);
  };

  const testNotification = () => {
    websocketService.send('user_activity', {
      type: 'test_notification',
      message: 'Test notification sent at ' + new Date().toLocaleTimeString()
    });
  };

  const testAnalytics = () => {
    websocketService.requestAnalytics('7d');
  };

  const testSystemStatus = () => {
    websocketService.requestSystemStatus();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 shadow-xl"
      >
        <div className="flex items-center space-x-3 mb-3">
          <div className={`p-2 rounded-lg ${
            isConnected ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'
          }`}>
            {isConnected ? <FaWifi className="text-green-400" /> : <FaWifiOff className="text-red-400" />}
          </div>
          <div>
            <h3 className="text-white font-poppins font-semibold text-sm">Real-Time Status</h3>
            <p className="text-white/60 font-poppins text-xs">
              {isConnected ? 'Connected' : 'Disconnected'}
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/70">Messages:</span>
            <span className="text-white font-semibold">{messageCount}</span>
          </div>
          {lastMessage && (
            <div className="text-xs text-white/60">
              Last: {lastMessage.type || 'Unknown'}
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={testNotification}
            className="p-2 bg-blue-500/20 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors duration-200"
            title="Test Notification"
          >
            <FaBell className="text-blue-400 text-sm" />
          </button>
          <button
            onClick={testAnalytics}
            className="p-2 bg-green-500/20 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors duration-200"
            title="Test Analytics"
          >
            <FaChartLine className="text-green-400 text-sm" />
          </button>
          <button
            onClick={testSystemStatus}
            className="p-2 bg-purple-500/20 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 transition-colors duration-200"
            title="Test System Status"
          >
            <FaServer className="text-purple-400 text-sm" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RealTimeStatus; 