const User = require('../models/User');

class UserController {
  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) return res.status(404).json({ message: 'User not found' });

      return res.status(200).json({ user });
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await User.find();
      return res.status(200).json({ users });
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}

module.exports = new UserController();
