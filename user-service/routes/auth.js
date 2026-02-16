const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const redisClient = require("../config/redis");

const router = express.Router();

/* ---------------- REGISTER ---------------- */

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    password: hashedPassword
  });

  await user.save();

  res.json({ message: "User registered successfully" });
});

/* ---------------- LOGIN (WITH REDIS) ---------------- */

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // 1. Check Redis cache
  const cachedUser = await redisClient.get(username);
  if (cachedUser) {
    return res.json(JSON.parse(cachedUser));
  }

  // 2. Check MongoDB
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ msg: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Wrong password" });

  const response = {
    message: "Login successful",
    userId: user._id
  };

  // 3. Store result in Redis
  await redisClient.set(username, JSON.stringify(response));

  res.json(response);
});

module.exports = router;
