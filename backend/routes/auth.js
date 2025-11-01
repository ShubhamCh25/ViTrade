// backend/routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();


router.post("/signup", async (req, res) => {
  try {
    const { username, password, vitmail, vitReg, phone } = req.body;
    if (!username || !password || !vitmail || !vitReg || !phone)
      return res.status(400).json({ message: "Missing fields" });

    const exists = await User.findOne({ $or: [{ username }, { vitmail }, { vitReg }] });
    if (exists) return res.status(409).json({ message: "username/vitmail/vitReg already used" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ username, passwordHash, vitmail, vitReg, phone });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.status(201).json({ user: { id: user._id, username, vitmail, vitReg, phone }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.json({ user: { id: user._id, username: user.username, vitmail: user.vitmail, vitReg: user.vitReg }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
