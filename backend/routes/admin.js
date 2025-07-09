const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../database");
const { authenticateToken } = require("../middleware/auth");
const multer = require('multer');
const adminController = require('../controllers/adminController');

const upload = multer({ dest: 'uploads/' });

// Hardcoded admin user (replace with database later)
const adminUser = {
  id: 1,
  email: "admin@careersolutions.com",
  password: "$2b$10$CW3jJG96cvk7LHfbxTIuvuZiOxTvBd3SzT/O2lBrHMoJW5G8bWQqK", // Replace with the actual hash for "admin123"
};

// POST /api/admin/login - Admin login
router.post("/login", async (req, res) => {
  try {
    console.log("Received login request body:", req.body);
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    console.log(
      "Comparing email:",
      email,
      "with admin email:",
      adminUser.email
    ); // Debug log
    // Check if admin exists
    if (email !== adminUser.email) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    console.log("Comparing password for email:", email); // Debug log
    // Check password
    const isMatch = await bcrypt.compare(password, adminUser.password);
    console.log("Password match result:", isMatch); // Debug log
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: adminUser.id, email: adminUser.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ message: "Login successful.", token });
  } catch (err) {
    console.error("Error in admin login:", err);
    res.status(500).json({ message: "An error occurred during login." });
  }
});

// GET /api/admin/dashboard - Dashboard stats
router.get("/dashboard", authenticateToken, async (req, res) => {
  try {
    // Get counts from different tables
    const [bookingsCount] = await db("bookings").count("* as count");
    const [enquiriesCount] = await db("enquiries").count("* as count");
    const [jobsCount] = await db("jobs").count("* as count");
    const [usersCount] = await db("users").count("* as count");
    const [contentCount] = await db("content").count("* as count");
    const [feedPostsCount] = await db("feed_posts").count("* as count");

    // Get recent activity
    const recentBookings = await db("bookings")
      .select("*")
      .orderBy("created_at", "desc")
      .limit(5);

    const recentEnquiries = await db("enquiries")
      .select("*")
      .orderBy("created_at", "desc")
      .limit(5);

    // Generate mock data for charts and analytics
    const viewsOverTime = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      views: Math.floor(Math.random() * 1000) + 500
    }));

    const bookingsOverTime = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      bookings: Math.floor(Math.random() * 20) + 5
    }));

    const enquiriesOverTime = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      enquiries: Math.floor(Math.random() * 15) + 3
    }));

    // Mock top pages data
    const topPages = [
      { page: "/", views: 1250 },
      { page: "/jobs", views: 890 },
      { page: "/services", views: 650 },
      { page: "/about", views: 420 },
      { page: "/contact", views: 380 }
    ];

    // Mock device stats
    const deviceStats = [
      { device: "Desktop", percentage: 65 },
      { device: "Mobile", percentage: 30 },
      { device: "Tablet", percentage: 5 }
    ];

    // Mock recent events
    const recentEvents = [
      { type: "booking", message: "New booking received", timestamp: new Date().toISOString() },
      { type: "enquiry", message: "New enquiry submitted", timestamp: new Date(Date.now() - 3600000).toISOString() },
      { type: "user", message: "New user registered", timestamp: new Date(Date.now() - 7200000).toISOString() }
    ];

    // Mock system alerts
    const systemAlerts = [
      {
        title: "System Performance",
        message: "CPU usage is within normal range",
        severity: "low",
        timestamp: new Date().toISOString()
      }
    ];

    // Mock notifications
    const recentNotifications = [
      {
        title: "New Booking",
        message: "Alice Johnson booked a consultation",
        created_at: new Date().toISOString()
      },
      {
        title: "New Enquiry",
        message: "Bob Smith submitted an enquiry",
        created_at: new Date(Date.now() - 3600000).toISOString()
      }
    ];

    const dashboardData = {
      kpis: {
        totalViews: Math.floor(Math.random() * 10000) + 5000,
        uniqueSessions: Math.floor(Math.random() * 5000) + 2000,
        totalClicks: Math.floor(Math.random() * 2000) + 1000,
        totalBookings: parseInt(bookingsCount.count),
        totalEnquiries: parseInt(enquiriesCount.count),
        totalUsers: parseInt(usersCount.count),
        conversionRate: Math.random() * 10,
        systemHealth: 'healthy',
        activeUsers: Math.floor(Math.random() * 100) + 50,
        responseTime: Math.random() * 100 + 50
      },
      charts: {
        viewsOverTime,
        bookingsOverTime,
        enquiriesOverTime
      },
      tables: {
        topPages,
        topReferrers: [
          { referrer: "Google", percentage: 45 },
          { referrer: "Direct", percentage: 30 },
          { referrer: "Social Media", percentage: 15 },
          { referrer: "Other", percentage: 10 }
        ],
        deviceStats,
        recentEvents,
        systemAlerts,
        recentNotifications
      },
      system: {
        cpu: Math.floor(Math.random() * 30) + 20,
        memory: Math.floor(Math.random() * 40) + 30,
        disk: Math.floor(Math.random() * 20) + 15,
        uptime: Math.floor(Math.random() * 30) + 10,
        lastBackup: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        securityStatus: 'secure'
      },
      recentBookings,
      recentEnquiries
    };

    res.status(200).json(dashboardData);
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ message: "An error occurred while fetching dashboard stats." });
  }
});

// GET /api/admin/stats - Alternative stats endpoint
router.get("/stats", authenticateToken, async (req, res) => {
  try {
    // Get counts from different tables
    const [bookingsCount] = await db("bookings").count("* as count");
    const [enquiriesCount] = await db("enquiries").count("* as count");
    const [jobsCount] = await db("jobs").count("* as count");
    const [usersCount] = await db("users").count("* as count");

    const stats = {
      totalBookings: bookingsCount.count,
      totalEnquiries: enquiriesCount.count,
      totalJobs: jobsCount.count,
      totalUsers: usersCount.count,
    };

    res.status(200).json(stats);
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ message: "An error occurred while fetching stats." });
  }
});

// GET /api/admin/users - Get all users
router.get("/users", authenticateToken, async (req, res) => {
  try {
    const users = await db("users").select("*");
    res.status(200).json({ users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "An error occurred while fetching users." });
  }
});

// PUT /api/admin/users/:id/role - Update user role
router.put("/users/:id/role", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    await db("users").where({ id }).update({ role });
    res.status(200).json({ message: "User role updated successfully." });
  } catch (err) {
    console.error("Error updating user role:", err);
    res.status(500).json({ message: "An error occurred while updating user role." });
  }
});

// GET /api/admin/bookings - Fetch all bookings (protected)
router.get("/bookings", authenticateToken, async (req, res) => {
  try {
    const bookings = await db("bookings").select("*");
    res.status(200).json({ bookings });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res
      .status(500)
      .json({ message: "An error occurred while fetching bookings." });
  }
});

// GET /api/admin/enquiries - Fetch all enquiries (protected)
router.get("/enquiries", authenticateToken, async (req, res) => {
  try {
    const enquiries = await db("enquiries").select("*");
    res.status(200).json({ enquiries });
  } catch (err) {
    console.error("Error fetching enquiries:", err);
    res
      .status(500)
      .json({ message: "An error occurred while fetching enquiries." });
  }
});

// GET /api/admin/tracking-events - Fetch all tracking events (protected)
router.get("/tracking-events", authenticateToken, async (req, res) => {
  try {
    const trackingEvents = await db("tracking_events").select("*");
    res.status(200).json({ trackingEvents });
  } catch (err) {
    console.error("Error fetching tracking events:", err);
    res
      .status(500)
      .json({ message: "An error occurred while fetching tracking events." });
  }
});

// Bulk data upload route
router.post('/bulk-upload', upload.single('file'), adminController.bulkUpload);

// Get all candidates with profile info
router.get('/candidates', adminController.getCandidates);

// Update candidate info
router.put('/candidates/:id', adminController.updateCandidate);

module.exports = router;
