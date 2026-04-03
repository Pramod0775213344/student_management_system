const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const dns = require("dns");
require("dotenv").config();

// Fix SRV record resolution error
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB...");

    const existingAdmin = await User.findOne({ email: "admin@test.com" });
    if (existingAdmin) {
      console.log("Admin already exists!");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = new User({
      email: "admin@test.com",
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();
    console.log("Default admin created: admin@test.com / admin123");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();
