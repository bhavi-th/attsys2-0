import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/verify", async (req, res) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ valid: false });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    res.status(200).json({ valid: true, user: decoded });
  } catch (err) {
    res.status(401).json({ valid: false });
  }
});

// LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email, role });
    if (!user) {
      return res
        .status(400)
        .json({ error: `No ${role} account found with this email.` });
    }

    // 2. Compare entered password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Create a Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "1d" },
    );

    // 3. If successful
    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error during login" });
  }
});

// REGISTER ROUTE (Moving it here to keep things organized)
router.post("/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const newUser = new User({ email, password, role });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("Detailed Error : ", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

export default router;
