const express = require("express");
const UserModel = require("../models/user");
const UserRoute = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

UserRoute.post("/signup", async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

UserRoute.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = UserRoute;
