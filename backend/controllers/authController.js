const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, phoneNumber, password, team, title } = req.body;

    // 1. Strict Password Validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        message: 'Password must be 8+ characters and contain at least one uppercase, lowercase, number, and special character.' 
      });
    }

    // 2. Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 3. Create the user
    const user = await User.create({
      name,
      email,
      phoneNumber,
      password,
      team,
      title
    });

    // 4. Send success response
    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        team: user.team,
        title: user.title,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    // If it's a Mongoose validation error (like the email check), send that specific message
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(val => val.message).join(', ');
      return res.status(400).json({ message });
    }
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // NEW: Check if the user is approved by the Executive Team
      if (!user.isApproved && user.team === 'General') {
        return res.status(401).json({ message: 'Account is pending Executive approval. Please check back later.' });
      }

      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        team: user.team,
        title: user.title,
        stats: user.stats,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};