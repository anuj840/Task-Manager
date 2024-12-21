const mongoose = require('mongoose');

// Team Schema
const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Manager/Admin
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Team', TeamSchema);
