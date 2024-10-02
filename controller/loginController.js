const express = require("express");
const User = require("../models/admin.model");
const Bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const loginHandler = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    console.log(user);
    if (!user) return res.status(400).json({ error: "user not found" });

    const isMatch = await Bcryptjs.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = loginHandler;
