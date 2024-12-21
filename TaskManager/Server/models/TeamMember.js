 

const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',  
      required: true,
    },
    userIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
        required: true,
      },
    ],
  },
  {
    timestamps: true,  
  }
);

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

module.exports = TeamMember;
