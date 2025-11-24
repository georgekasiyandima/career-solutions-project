require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const { authenticateToken, authorizeRole } = require("./middleware/auth");
const app = express();
const server = http.createServer(app);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;

// WebSocket server
const wss = new WebSocket.Server({ server });

// WebSocket connection management
const clients = new Map();
const rooms = new Map();

// WebSocket authentication middleware
const authenticateWebSocket = (info) => {
  try {
    const url = new URL(info.req.url, 'http://localhost');
    const token = url.searchParams.get('token');
    
    if (!token) {
      return null;
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('WebSocket authentication failed:', error);
    return null;
  }
};

// WebSocket connection handler
wss.on('connection', (ws, req) => {
  const user = authenticateWebSocket(req);
  
  if (!user) {
    ws.close(1008, 'Authentication failed');
    return;
  }

  console.log(`WebSocket connected: ${user.id} (${user.role})`);
  
  clients.set(user.id, {
    ws,
    user,
    connectedAt: new Date(),
    lastActivity: new Date()
  });

  if (!rooms.has(user.role)) {
    rooms.set(user.role, new Set());
  }
  rooms.get(user.role).add(user.id);

  ws.send(JSON.stringify({
    type: 'connected',
    data: {
      userId: user.id,
      role: user.role,
      timestamp: new Date().toISOString()
    }
  }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      handleWebSocketMessage(ws, user, data);
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  });

  ws.on('close', (code, reason) => {
    console.log(`WebSocket disconnected: ${user.id} (${code}: ${reason})`);
    clients.delete(user.id);
    if (rooms.has(user.role)) {
      rooms.get(user.role).delete(user.id);
    }
  });

  ws.on('error', (error) => {
    console.error(`WebSocket error for user ${user.id}:`, error);
  });
});

// Handle WebSocket messages
const handleWebSocketMessage = (ws, user, data) => {
  const { type, data: messageData } = data;
  const client = clients.get(user.id);
  if (client) client.lastActivity = new Date();

  switch (type) {
    case 'ping':
      ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
      break;
    case 'request_analytics':
      handleAnalyticsRequest(ws, user, messageData);
      break;
    case 'request_notifications':
      handleNotificationsRequest(ws, user, messageData);
      break;
    case 'request_system_status':
      handleSystemStatusRequest(ws, user);
      break;
    case 'user_activity':
      broadcastToAdmins({
        type: 'user_activity',
        data: { ...messageData, userId: user.id, timestamp: new Date().toISOString() }
      });
      break;
    case 'update_job':
      handleJobUpdate(ws, user, messageData);
      break;
    case 'update_content':
      handleContentUpdate(ws, user, messageData);
      break;
    default:
      console.log('Unknown WebSocket message type:', type);
  }
};

// Handle analytics request
const handleAnalyticsRequest = async (ws, user, data) => {
  try {
    const analytics = {
      totalViews: Math.floor(Math.random() * 10000),
      uniqueSessions: Math.floor(Math.random() * 5000),
      totalClicks: Math.floor(Math.random() * 2000),
      conversionRate: Math.random() * 10
    };
    ws.send(JSON.stringify({ type: 'analytics_update', data: analytics }));
  } catch (error) {
    console.error('Analytics request error:', error);
  }
};

// Handle notifications request
const handleNotificationsRequest = async (ws, user, data) => {
  try {
    const notifications = [{
      id: 1,
      title: 'New booking received',
      message: 'A new booking has been submitted',
      type: 'booking',
      created_at: new Date().toISOString()
    }];
    ws.send(JSON.stringify({ type: 'notification', data: notifications }));
  } catch (error) {
    console.error('Notifications request error:', error);
  }
};

// Handle system status request
const handleSystemStatusRequest = async (ws, user) => {
  try {
    const systemStatus = {
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      disk: Math.random() * 100,
      uptime: Math.floor(Math.random() * 30),
      securityStatus: 'secure'
    };
    ws.send(JSON.stringify({ type: 'system_status', data: systemStatus }));
  } catch (error) {
    console.error('System status request error:', error);
  }
};

// Handle job update
const handleJobUpdate = async (ws, user, data) => {
  try {
    console.log('Job update:', data);
    broadcastToAdmins({
      type: 'job_update',
      data: { ...data, updatedBy: user.id, timestamp: new Date().toISOString() }
    });
    ws.send(JSON.stringify({ type: 'job_update_success', data: { jobId: data.jobId } }));
  } catch (error) {
    console.error('Job update error:', error);
  }
};

// Handle content update
const handleContentUpdate = async (ws, user, data) => {
  try {
    console.log('Content update:', data);
    broadcastToAdmins({
      type: 'content_update',
      data: { ...data, updatedBy: user.id, timestamp: new Date().toISOString() }
    });
    ws.send(JSON.stringify({ type: 'content_update_success', data: { contentId: data.contentId } }));
  } catch (error) {
    console.error('Content update error:', error);
  }
};

// Broadcast functions
const broadcastToAdmins = (message) => {
  const adminRoom = rooms.get('admin');
  if (adminRoom) {
    adminRoom.forEach(userId => {
      const client = clients.get(userId);
      if (client && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message));
      }
    });
  }
};

const broadcastToUser = (userId, message) => {
  const client = clients.get(userId);
  if (client && client.ws.readyState === WebSocket.OPEN) {
    client.ws.send(JSON.stringify(message));
  }
};

const broadcastToAll = (message) => {
  clients.forEach((client) => {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  });
};

app.locals.broadcastToAdmins = broadcastToAdmins;
app.locals.broadcastToUser = broadcastToUser;
app.locals.broadcastToAll = broadcastToAll;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Serve static files
app.use("/public", express.static("public"));
app.use("/uploads", express.static("uploads"));

// Public routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/booking", require("./routes/bookings"));
app.use("/api/enquiry", require("./routes/enquiries"));
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/success-stories", require("./routes/successStories"));
app.use("/api/feed", require("./routes/feed"));
app.use("/api/track", require("./routes/track"));
app.use("/api/search", require("./routes/search"));
app.use("/api/interview-resources", require("./routes/interviewResources"));
app.use("/api/testimonials", require("./routes/testimonials"));
app.use("/api/services", require("./routes/services"));
app.use("/api/service-orders", require("./routes/serviceOrders"));
app.use("/api/testimonials-metrics", require("./routes/testimonialsMetrics"));
app.use("/api/career-updates", require("./routes/careerUpdates"));
app.use("/api/facts", require("./routes/facts"));

// Protected routes
app.use("/api/notifications", require("./routes/notifications"));

// Public analytics route for tracking
app.use("/api/analytics", require("./routes/businessAnalytics"));

// Protected admin routes
app.use("/api/admin/analytics", authenticateToken, authorizeRole(['admin']), require("./routes/analytics"));
app.use("/api/admin", authenticateToken, authorizeRole(['admin']), require("./routes/admin"));
app.use("/api/subscriptions", authenticateToken, authorizeRole(['admin']), require("./routes/subscriptions"));
app.use("/api/job-sends", authenticateToken, authorizeRole(['admin']), require("./routes/jobSends"));
app.use("/api/clients", authenticateToken, authorizeRole(['admin']), require("./routes/clients"));
app.use("/api/content", authenticateToken, authorizeRole(['admin']), require("./routes/content"));
app.use("/api/users", authenticateToken, authorizeRole(['admin']), require("./routes/users"));
app.use("/api/roles", authenticateToken, authorizeRole(['admin']), require("./routes/roles"));
app.use("/api/admin/interview-resources", authenticateToken, authorizeRole(['admin']), require("./routes/interviewResources"));
app.use("/api/uploads", authenticateToken, authorizeRole(['admin']), require("./routes/uploads"));
app.use("/api/performance", authenticateToken, authorizeRole(["admin"]), require("./routes/performance"));
app.use('/api/faqs', require('./routes/faqs'));

// WebSocket endpoint
app.get('/ws', (req, res) => {
  res.send('WebSocket endpoint - use WebSocket protocol to connect');
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));