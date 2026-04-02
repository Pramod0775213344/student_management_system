require("dotenv").config();
const mongoose = require("mongoose");
const dns = require('dns');

// Force public DNS servers
dns.setServers(['8.8.8.8', '1.1.1.1']);

const bcrypt = require("bcryptjs");
const User = require("./models/User");

// Seeder function
const seedAdmin = async () => {
  const email = "admin@gmail.com";
  const password = "12345";

  try {
    // DB connection
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB connected for seeding");

    // check if admin exists
    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log("Admin already exists");
      mongoose.connection.close();
      return;
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create admin
    const newAdmin = new User({
      email,
      password: hashedPassword,
      role: "admin",
    });

    await newAdmin.save();
    
    console.log("Admin created successfully");
    console.log("Email:", email);
    console.log("Password:", password);

  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    mongoose.connection.close();
  }
};

seedAdmin();
