class WebSocketService {
  constructor() {
    this.ws = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  connect(token) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws?token=${token}`;
        
        this.ws = new WebSocket(wsUrl);
        
        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.isConnected = true;
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
          this.emit('disconnected', event);
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

      } catch (error) {
        console.error('Failed to create WebSocket connection:', error);
        reject(error);
      }
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    this.isConnected = false;
  }

  send(type, data = {}) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not connected, cannot send message');
      return false;
    }

    try {
      const message = { type, data, timestamp: Date.now() };
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
    const { type, data: payload } = data;
    
    switch (type) {
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
      default:
        console.log('Unknown WebSocket message type:', type);
    }
  }

  requestNotifications(limit = 10) {
    this.send('request_notifications', { limit });
  }

  requestAnalytics(period = '30d') {
    this.send('request_analytics', { period });
  }

  requestSystemStatus() {
    this.send('request_system_status');
  }
}

const websocketService = new WebSocketService();
export default websocketService;
