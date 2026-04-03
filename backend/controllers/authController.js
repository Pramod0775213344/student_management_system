const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// login eka
exports.login = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).send("Email and password are required. Make sure you are sending JSON data.");
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).send("Invalid email or password");
    }

    // user type karan password ekaia databe passwrod ekai match karanwaa
    const isMatch = await bcrypt.compare(password, user.password);

    // meka false wunoth error masg eka sen ekaranwa
    if (!isMatch) {
      return res.status(401).send("Invalid email or password");
    }

    // jwt payload
    const payload = {
      id: user._id,
      role: user.role,
    };

    // token eka create karawnaw
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });

    res.json({
      token,
      user: {
        id: user._id,
        role: user.role,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
// Admin account creation logic
exports.createAccount = async (req, res) => {
  const { email, password, role, linkedId } = req.body || {};

  if (!email || !password || !role) {
    return res.status(400).send("Email, password, and role are required.");
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists with this email.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      role,
      studentId: role === "student" ? linkedId : undefined,
      teacherId: role === "teacher" ? linkedId : undefined,
    });

    await newUser.save();

    res.status(201).json({
      message: "Account created successfully",
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error during account creation");
  }
};
