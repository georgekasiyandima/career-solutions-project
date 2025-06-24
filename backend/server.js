require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Serve static files from the public directory
app.use("/public", express.static("public"));

// Routes
app.use("/api/booking", require("./routes/bookings"));
app.use("/api/enquiry", require("./routes/enquiries"));
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/success-stories", require("./routes/successStories"));
app.use("/api/feed", require("./routes/feed"));
app.use("/api/track", require("./routes/track"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/subscriptions", require("./routes/subscriptions"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
