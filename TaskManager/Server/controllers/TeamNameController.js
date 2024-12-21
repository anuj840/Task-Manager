// const Team = require('../models/Team');

// class TeamController {
//   // Create a new team with a name
//   async createTeam(req, res) {
//     try {
//       const { name } = req.body;

//       // Check if user is a manager or admin
//       if (req.user.role !== 'manager' && req.user.role !== 'admin') {
//         return res.status(403).json({ message: 'You do not have permission to create teams.' });
//       }

//       // Check if a team with the same name already exists
//       const existingTeam = await Team.findOne({ name });
//       if (existingTeam) {
//         return res.status(400).json({ message: 'A team with this name already exists.' });
//       }

//       // Create a new team
//       const team = new Team({
//         name,
//         createdBy: req.user._id, // Track the user who created the team
//       });

//       await team.save();
//       res.status(201).json({ message: 'Team created successfully', team });
//     } catch (err) {
//       console.error('Error in createTeam:', err);
//       res.status(500).json({ message: 'Server error' });
//     }
//   }

//   // Fetch all teams or a specific team by ID
//   async getTeams(req, res) {
//     try {
//       const { teamId } = req.params;

//       if (teamId) {
//         const team = await Team.findById(teamId).populate('createdBy', 'username email');
//         if (!team) {
//           return res.status(404).json({ message: 'Team not found' });
//         }
//         return res.status(200).json(team);
//       }

//       const teams = await Team.find().populate('createdBy', 'username email');
//       res.status(200).json(teams);
//     } catch (err) {
//       console.error('Error in getTeams:', err);
//       res.status(500).json({ message: 'Server error' });
//     }
//   }
// }

// module.exports = new TeamController();


const Team = require('../models/Team');

class TeamController {
  // Create a new team with a name
  async createTeam(req, res) {
    try {
      const { name } = req.body;

      // Check if user is a manager or admin
      if (req.user.role !== 'manager' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'You do not have permission to create teams.' });
      }

      // Check if a team with the same name already exists
      const existingTeam = await Team.findOne({ name });
      if (existingTeam) {
        return res.status(400).json({ message: 'A team with this name already exists.' });
      }

      // Create a new team
      const team = new Team({
        name,
        createdBy: req.user._id, // Track the user who created the team
      });

      await team.save();
      res.status(201).json({ message: 'Team created successfully', team });
    } catch (err) {
      console.error('Error in createTeam:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Fetch all teams or a specific team by ID
  async getTeams(req, res) {
    try {
      const { teamId } = req.params;

      if (teamId) {
        const team = await Team.findById(teamId).populate('createdBy', 'username email');
        if (!team) {
          return res.status(404).json({ message: 'Team not found' });
        }
        return res.status(200).json(team);
      }

      const teams = await Team.find().populate('createdBy', 'username email');
      res.status(200).json(teams);
    } catch (err) {
      console.error('Error in getTeams:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Update a team's name
  async updateTeam(req, res) {
    try {
      const { teamId } = req.params;
      const { name } = req.body;

      // Check if user is a manager, admin, or the creator of the team
      const team = await Team.findById(teamId);
      if (!team) {
        return res.status(404).json({ message: 'Team not found' });
      }

      if (req.user.role !== 'admin' && team.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You do not have permission to update this team.' });
      }

      // Check if a team with the same name already exists
      const existingTeam = await Team.findOne({ name });
      if (existingTeam && existingTeam._id.toString() !== teamId) {
        return res.status(400).json({ message: 'A team with this name already exists.' });
      }

      // Update the team name
      team.name = name;
      await team.save();

      res.status(200).json({ message: 'Team updated successfully', team });
    } catch (err) {
      console.error('Error in updateTeam:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Delete a team
 
async deleteTeam(req, res) {
  try {
    const { teamId } = req.params;

    // Check if user is authorized to delete the team (manager, admin, or creator)
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (req.user.role !== 'admin' && team.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You do not have permission to delete this team.' });
    }

    // Use deleteOne to remove the team
    await Team.deleteOne({ _id: teamId });

    res.status(200).json({ message: 'Team deleted successfully' });
  } catch (err) {
    console.error('Error in deleteTeam:', err);
    res.status(500).json({ message: 'Server error' });
  }
}


}

module.exports = new TeamController();
