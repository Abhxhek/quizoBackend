const Bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/admin.model");
require('dotenv').config();



const signupHandler = async (req, res) => {
  try {
    const { email,username, password } = req.body;
    const hashedPassword = await Bcryptjs.hash(password, 10);
    
    const user = new User({ email, username, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ 
      message: "Admin registered successfully!",
      user:user,
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = signupHandler;
