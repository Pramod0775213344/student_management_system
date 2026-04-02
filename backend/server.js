const express = require("express");
require("dotenv").config();

const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectDB = require("./config/db");

// DB Connect
connectDB();

const authRoutes = require("./routes/authRoutes");


const mongoose = require("mongoose");

app.use("/api/auth", authRoutes);

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
  if (dbStatus === "Connected") {
    res.status(200).json({ status: "UP", db: dbStatus });
  } else {
    res.status(500).json({ status: "DOWN", db: dbStatus });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server running...");
});
