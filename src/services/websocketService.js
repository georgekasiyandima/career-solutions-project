class WebSocketService {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.listeners = new Map();
    this.isConnected = false;
    this.heartbeatInterval = null;
    this.heartbeatTimeout = null;
    this.connectionPromise = null;
  }

  connect(token) {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        console.log('WebSocket already connected');
        resolve();
        return;
      }

      try {
        // Use secure WebSocket in production
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws?token=${token}`;
        
        this.ws = new WebSocket(wsUrl);
        
        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          this.emit('connected');
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          this.isConnected = false;
          this.stopHeartbeat();
          this.connectionPromise = null;
          this.emit('disconnected', event);
          
          if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.emit('error', error);
          reject(error);
        };

      } catch (error) {
        console.error('Failed to create WebSocket connection:', error);
        this.emit('error', error);
        reject(error);
      }
    });

    return this.connectionPromise;
  }

  disconnect() {
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    this.isConnected = false;
    this.stopHeartbeat();
    this.connectionPromise = null;
  }

  send(type, data = {}) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not connected, cannot send message');
      return false;
    }

    try {
      const message = {
        type,
        data,
        timestamp: Date.now()
      };
      
      this.ws.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('Failed to send WebSocket message:', error);
      return false;
    }
  }

  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  unsubscribe(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in WebSocket event callback:', error);
        }
      });
    }
  }

  handleMessage(data) {
    const { type, data: payload, timestamp } = data;
    
    switch (type) {
      case 'connected':
        this.emit('connected', payload);
        break;
      case 'notification':
        this.emit('notification', payload);
        break;
      case 'analytics_update':
        this.emit('analytics_update', payload);
        break;
      case 'system_alert':
        this.emit('system_alert', payload);
        break;
      case 'user_activity':
        this.emit('user_activity', payload);
        break;
      case 'job_update':
        this.emit('job_update', payload);
        break;
      case 'content_update':
        this.emit('content_update', payload);
        break;
      case 'pong':
        this.handlePong();
        break;
      default:
        console.log('Unknown WebSocket message type:', type);
    }
  }

  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.send('ping');
      
      // Set timeout for pong response
      this.heartbeatTimeout = setTimeout(() => {
        console.warn('WebSocket heartbeat timeout');
        this.ws.close();
      }, 5000);
    }, 30000); // Send ping every 30 seconds
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
      this.heartbeatTimeout = null;
    }
  }

  handlePong() {
    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
      this.heartbeatTimeout = null;
    }
  }

  scheduleReconnect() {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Scheduling WebSocket reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      const token = localStorage.getItem('token');
      if (token) {
        this.connect(token);
      }
    }, delay);
  }

  // Convenience methods for specific message types
  subscribeToNotifications(callback) {
    this.subscribe('notification', callback);
  }

  subscribeToAnalytics(callback) {
    this.subscribe('analytics_update', callback);
  }

  subscribeToSystemAlerts(callback) {
    this.subscribe('system_alert', callback);
  }

  subscribeToUserActivity(callback) {
    this.subscribe('user_activity', callback);
  }

  subscribeToJobUpdates(callback) {
    this.subscribe('job_update', callback);
  }

  subscribeToContentUpdates(callback) {
    this.subscribe('content_update', callback);
  }

  // Request specific data
  requestAnalytics(period = '30d') {
    this.send('request_analytics', { period });
  }

  requestNotifications(limit = 10) {
    this.send('request_notifications', { limit });
  }

  requestSystemStatus() {
    this.send('request_system_status');
  }

  // Send user activity
  trackUserActivity(activity) {
    this.send('user_activity', activity);
  }

  // Send job updates
  updateJob(jobId, updates) {
    this.send('update_job', { jobId, updates });
  }

  // Send content updates
  updateContent(contentId, updates) {
    this.send('update_content', { contentId, updates });
  }
}

// Create singleton instance
const websocketService = new WebSocketService();

export default websocketService; 