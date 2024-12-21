const TeamMember = require('../models/TeamMember');
const User = require('../models/User'); // Assuming there's a User schema
const Team = require('../models/Team');
class TeamMemberController {



  async addTeamMembers(req, res) {
    try {
      const { teamId, userIds } = req.body;

      // Validate required fields
      if (!teamId || !Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ message: 'Team ID and user IDs are required.' });
      }

      // Validate if the team exists
      const team = await Team.findById(teamId);
      if (!team) {
        return res.status(404).json({ message: 'Team not found.' });
      }

      // Validate if all users exist
      const validUsers = await User.find({ _id: { $in: userIds } });
      if (validUsers.length !== userIds.length) {
        return res.status(400).json({ message: 'One or more user IDs are invalid.' });
      }

      // Save team with users
      const newTeamMember = new TeamMember({
        teamId,
        userIds,
      });

      const savedTeamMember = await newTeamMember.save();
      res.status(201).json({
        message: 'Team members saved successfully.',
        data: savedTeamMember,
      });
    } catch (error) {
      console.error('Error saving team members:', error);
      res.status(500).json({ message: 'Server error occurred.' });
    }
  }

  


   


  async getTeamMembers(req, res) {
    const { teamId } = req.params;
  
    try {
      // Validate teamId
      if (!teamId) {
        return res.status(400).json({ error: 'Team ID is required' });
      }
  
      // Check if team exists
      const team = await Team.findById(teamId);
      if (!team) {
        return res.status(404).json({ error: 'Team not found' });
      }
  
      // Fetch team members based on teamId
      const teamMembers = await TeamMember.findOne({ teamId }).populate('userIds', 'username name email'); // Include 'username'
  
      if (!teamMembers) {
        return res.status(404).json({ error: 'No members found for this team' });
      }
  
      // Send response
      res.status(200).json({
        team: {
          id: team._id,
          name: team.name,
        },
        members: teamMembers.userIds, // Includes 'username', 'name', and 'email'
      });
    } catch (error) {
      console.error('Error fetching team members:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
  

  
}





module.exports = new TeamMemberController();
