const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
require('dotenv').config();

class AuthController {
  /**
   * Register a new user
   */
 
  


  async register(req, res) {
    try {
      console.log(req.body);  // Add this to check the incoming data
      
      // Log to check if .env variables are loaded correctly
      console.log('Email User:', process.env.EMAIL_USER);
      console.log('Email Pass:', process.env.EMAIL_PASS);
  
      const { username, email, password, role } = req.body;
  
      // Set default role to "user" if no role is provided
      const userRole = role || 'user';
  
      // Validate the role (only if provided)
      if (role && !['user', 'admin', 'manager'].includes(role)) {
        return res.status(400).json({ message: 'Role must be "user", "admin", or "manager"' });
      }
  
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user with the provided role (or default to "user")
      const user = new User({ username, email, password: hashedPassword, role: userRole });
      await user.save();
  
      // Send confirmation email to the user
      const transporter = nodemailer.createTransport({
        logger: true, // Enable logging
        debug: true, // Enable debug output
        host: 'mail.techlightz.com', // Hostinger SMTP server
        port: 465, // SSL port (or use 587 for TLS)
        secure: true, // Use SSL (change to false for TLS)
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Registration Successful',
        text: `Hello ${username},\n\nYou have successfully registered to our system.\n\nBest regards,\nYour Company Name`,
      };
  
      // Send the email
      await transporter.sendMail(mailOptions);
  
      // Respond with the success message
      return res.status(201).json({
        message: 'User registered successfully, a confirmation email has been sent.',
        user: { id: user._id, email, role: userRole },
      });
    } catch (error) {
      console.error('Register Error:', error.message);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
  
 

  

  /**
 * Fetch all users
 */
/**
 * Fetch all users with count
 */
async getUsers(req, res) {
  try {
    // Fetch all users from the database, excluding password field for security
    const users = await User.find({}, { password: 0 });

    // Fetch the total count of users in the database
    const totalUsers = await User.countDocuments();

    // If no users found
    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    // Return the users and the total count
    return res.status(200).json({
      message: 'Users fetched successfully',
      totalUsers,  // Total number of users
      users,       // The list of users
    });
  } catch (error) {
    console.error('Fetch Users Error:', error.message);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}



  /**
   * Login a user
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Generate JWT
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        message: 'Login successful',
        token,
        user: { id: user._id, email: user.email, role: user.role, username: user.username  },
      });
    } catch (error) {
      console.error('Login Error:', error.message);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  /**
   * Logout a user
   */
  async logout(req, res) {
    try {
      // For token-based systems, consider implementing token invalidation using a blacklist
      return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout Error:', error.message);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
  async user_logout(req, res) {
    try {
      // For token-based systems, consider implementing token invalidation using a blacklist
      return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout Error:', error.message);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}

module.exports = new AuthController();

