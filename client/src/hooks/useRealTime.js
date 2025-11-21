import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import websocketService from '../services/websocketService';

const useRealTime = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const connect = useCallback(async (token) => {
    try {
      await websocketService.connect(token);
      setIsConnected(true);
      setError(null);
    } catch (err) {
      setError('Failed to connect to WebSocket');
      console.error('WebSocket connection error:', err);
    }
  }, []);

  const disconnect = useCallback(() => {
    websocketService.disconnect();
    setIsConnected(false);
  }, []);

  const sendMessage = useCallback((type, data = {}) => {
    return websocketService.send(type, data);
  }, []);

  useEffect(() => {
    if (isAuthenticated()) {
      const token = localStorage.getItem('token');
      if (token) {
        connect(token);
      }
    }

    return () => {
      disconnect();
    };
  }, [isAuthenticated, connect, disconnect]);

  useEffect(() => {
    const handleMessage = (data) => {
      setLastMessage(data);
    };

    websocketService.subscribe('notification', handleMessage);
    websocketService.subscribe('analytics_update', handleMessage);
    websocketService.subscribe('system_alert', handleMessage);
    websocketService.subscribe('user_activity', handleMessage);

    return () => {
      websocketService.unsubscribe('notification', handleMessage);
      websocketService.unsubscribe('analytics_update', handleMessage);
      websocketService.unsubscribe('system_alert', handleMessage);
      websocketService.unsubscribe('user_activity', handleMessage);
    };
  }, []);

  return {
    isConnected,
    lastMessage,
    error,
    sendMessage,
    connect,
    disconnect
  };
};

export default useRealTime;
