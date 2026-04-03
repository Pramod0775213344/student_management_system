const express = require("express");
const mongoose = require("mongoose");
const dns = require("dns");
require("dotenv").config();

// Fix DNS resolution for MongoDB Atlas SRV records
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectDB = require("./config/db");

// DB Connect
connectDB();

// Initialize all Mongoose models
require("./models");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const academicRoutes = require("./routes/academicRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const examRoutes = require("./routes/examRoutes");
const feeRoutes = require("./routes/feeRoutes");
const teacherRoutes = require("./routes/teacherRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/academic", academicRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/teachers", teacherRoutes);

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
  if (dbStatus === "Connected") {
    res.status(200).json({ status: "UP", db: dbStatus });
  } else {
    res.status(500).json({ status: "DOWN", db: dbStatus });
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("SERVER CRASH:", err);
  res.status(500).json({
    message: "සර්වර් එකේ දෝෂයක් සිදුවිය (Internal Server Error)",
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
