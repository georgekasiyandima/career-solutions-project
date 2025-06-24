const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../database");
const authenticateToken = require("../middleware/auth");

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

module.exports = router;
