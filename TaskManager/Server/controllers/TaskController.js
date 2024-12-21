const Task = require('../models/Task');
const User = require('../models/User'); 
const mongoose = require('mongoose');
const Team = require('../models/Team'); // Adjust the path based on your file structure
const TeamMember = require('../models/TeamMember');
const TaskProgress = require('../models/TaskStatus');
 
class TaskController {
    

  async createTask(req, res) {
    try {
      console.log('Incoming request to createTask:', req.body);
  
      const { title, description, dueDate, priority, userId, teamId } = req.body;
      console.log('Extracted data:', { title, description, dueDate, priority, userId, teamId });
  
      // Check if the user is a manager or admin
      if (req.user.role !== 'manager' && req.user.role !== 'admin') {
        console.log(`Permission denied for user role: ${req.user.role}`);
        return res.status(403).json({ message: 'You do not have permission to assign tasks.' });
      }
  
      let assignedTo = null;
  
      // Validate the userId if provided
      if (userId) {
        console.log(`Validating userId: ${userId}`);
        const assignedUser = await User.findById(userId);
        if (!assignedUser) {
          console.log('Assigned user not found:', userId);
          return res.status(404).json({ message: 'Assigned user not found.' });
        }
        console.log('Assigned user found:', assignedUser);
        assignedTo = userId;
      }
      // Validate the teamId if provided
      else if (teamId) {
        console.log(`Validating teamId: ${teamId}`);
        const assignedTeam = await Team.findById(teamId);
        if (!assignedTeam) {
          console.log('Assigned team not found:', teamId);
          return res.status(404).json({ message: 'Assigned team not found.' });
        }
        console.log('Assigned team found:', assignedTeam);
        assignedTo = teamId;
      } else {
        console.log('Neither userId nor teamId provided');
        return res.status(400).json({ message: 'You must provide either a userId or teamId.' });
      }
  
      // Create the task object
      const newTask = new Task({
        title,
        description,
        dueDate,
        priority,
        createdBy: req.user.id,
        assignedTo, // Store the assigned user or team ID
      });
      console.log('New task object created:', newTask);
  
      // Save the task to the database
      await newTask.save();
      console.log('Task saved to the database:', newTask);
  
      
if (userId) {
    // If a userId is provided, emit the event directly to that user
    console.log(`Emitting event to userId: ${userId}`);
    req.io.to(userId).emit('taskAdded', newTask);
} else if (teamId) {
    // If a teamId is provided, query the teamMembers schema to get the userIds
    console.log(`Emitting event to teamId: ${teamId}`);

    try {
        // Fetch user IDs associated with the team from the teamMembers schema
        const teamMembers = await TeamMember.find({ teamId: teamId }).select('userId');
        console.log("teamMembers",teamMembers)
        if (teamMembers && teamMembers.length > 0) {
            // Emit the event to each user in the team
            teamMembers.forEach(member => {
                console.log(`Emitting event to userId: ${member.userIds}`);
                req.io.to(member.userIds).emit('taskAdded', newTask);
            });
        } else {
            console.log('No users found for the team.');
        }
    } catch (error) {
        console.error('Error fetching team members:', error);
    }
}

  
      res.status(201).json(newTask);
    } catch (err) {
      console.error('Error in createTask:', err.message);
      console.error('Stack trace:', err.stack);
      res.status(500).json({ message: 'Server error' });
    }
  }
  
  
  
  
  
  
 
 
  // Get task by ID (for editing)
async getTaskById(req, res) {
  try {
    const { id } = req.params;
    
    // Find the task by ID
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // If the task is found, return it
    res.status(200).json({ task });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}


  // Get all tasks (Admins and managers can view all tasks, users only their own tasks)
  async getTasks(req, res) {
    try {
      // Debug: Log the authenticated user's ID
      console.log('Authenticated User ID:', req.user.id);

      // If the user is admin or manager, show all tasks, else show only their own tasks
      const tasks = req.user.role === 'admin' || req.user.role === 'manager'
        ? await Task.find()  // Admins and managers can see all tasks
        : await Task.find({ assignedTo: req.user.id });  // Regular user sees only their tasks

      if (tasks.length === 0) {
        console.log('No tasks found for this user.');
      }

      res.status(200).json({ tasks });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }


 

  async fetchUserTasks(req, res) {
    try {
      const userId = req.user.id;
    
      // Step 1: Fetch all teamIds where the 'userIds' field includes the current userId
      const teams = await TeamMember.find({ userIds: userId }).select('teamId');
      const teamIds = teams.map(team => team.teamId);
    
      // Step 2: Find tasks assigned directly to the user or to their team(s)
      const tasks = await Task.find({
        $or: [
          { assignedTo: userId },            // Directly assigned to the user
          { assignedTo: { $in: teamIds } }   // Assigned to a team the user is part of
        ]
      });
    
      // Step 3: Fetch the task progress data for the specific user and task
      const taskProgresses = await TaskProgress.find({
        taskId: { $in: tasks.map(task => task._id) }, // Match by taskId
        userId: userId  // Match by userId to get progress for the specific user
      });
    
      // Step 4: Add status to each task based on the taskProgresses data
      const tasksWithStatus = tasks.map(task => {
        const progress = taskProgresses.find(progress => progress.taskId.toString() === task._id.toString());
        return {
          ...task.toObject(),  // Spread the task properties
          status: progress ? progress.status : 'not started'  // Default to 'not started' if no progress is found
        };
      });
    
      // Step 5: Return the tasks with status
      res.status(200).json({
        message: 'Tasks fetched successfully',
        tasks: tasksWithStatus,
      });
    } catch (err) {
      console.error('Error fetching tasks:', err.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
  
  // Update an existing task
  async updateTask(req, res) {
    try {
      const taskId = req.params.id;
      const { title, description, dueDate, priority, status } = req.body; // Include 'status' in the request body
  
      // Find the task by ID and update it
      const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        { title, description, dueDate, priority, status }, // Include 'status' in the update object
        { new: true } // Return the updated task
      );
  
      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      // Broadcast the updated task to all connected clients via Socket.io
      req.io.emit('taskUpdated', updatedTask); // Emit to all clients
  
      res.status(200).json(updatedTask);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
  

  

  



 
  async   updateTaskStatus(req, res) {
    const { status } = req.body; // Get status from request body (removed progress)
    const { taskId } = req.params; // Get taskId from request parameters
    const { id } = req.user; // Get id from authenticated user (assuming JWT-based auth)
  
    try {
      // Validate input
      if (!status) {
        return res.status(400).json({ message: 'Status is required.' });
      }
  
      // Allowed status values (must match exactly)
      const allowedStatuses = ['pending', 'in-progress', 'completed'];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status. Allowed values: pending, in-progress, completed.' });
      }
  
      // Ensure id is available
      if (!id) {
        return res.status(400).json({ message: 'User ID is missing. Please login again.' });
      }
  
      // Log the id for debugging
      console.log('Authenticated user ID:', id);
  
      // Update or insert task status
      const taskStatus = await TaskProgress.findOneAndUpdate(
        { taskId, userId: id }, // Filter: taskId and userId combination
        { 
          status, 
          userId: id // Ensure userId (id) is explicitly passed here
        },
        { 
          upsert: true, // Insert if task does not exist
          new: true,    // Return the updated task
          setDefaultsOnInsert: true // Ensure default values on insert
        }
      );
  
      if (!taskStatus) {
        return res.status(404).json({ message: 'Task not found or not updated.' });
      }
  
      console.log('Task Status Updated Successfully:', taskStatus);
      return res.status(200).json({
        message: 'Task status updated successfully.',
        taskStatus,
      });
    } catch (error) {
      console.error('Error updating task status:', error.message);
      return res.status(500).json({ message: 'Server error' });
    }
  }
      

async deleteTask(req, res) {
  try {
    const { id } = req.params;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    console.log('Task ID:', id);  // Log the task ID
    console.log('User ID:', req.user.id);  // Log the user ID

    // Find and delete the task by ID and ensure it was created by the current user
    const task = await Task.findOneAndDelete({ _id: id, createdBy: req.user.id });

    console.log('Deleted Task:', task);  // Log the task found (or null if not found)

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Broadcast task deletion to all connected clients via Socket.io
    req.io.emit('taskDeleted', { id });  // Emit to all clients

    return res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error:', error);  // Log the error for better debugging
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}


 

async fetchUserIdsBasedOnTask(req, res) {
  try {
    const { taskId } = req.params;

    // Step 1: Fetch the task
    console.log('Fetching task with ID:', taskId);
    const task = await Task.findById(taskId);
    if (!task) {
      console.log('Task not found');
      return res.status(404).json({ message: 'Task not found' });
    }

    const assignedToId = task.assignedTo;
    console.log('Assigned ID:', assignedToId);

    if (!mongoose.Types.ObjectId.isValid(assignedToId)) {
      console.log('Invalid assignedTo ID format');
      return res.status(400).json({ message: 'Invalid assignedTo ID format' });
    }

    let userIds = [];

    // Step 2: Check if `assignedTo` is a direct `userId`
    const userExists = await User.findById(assignedToId);
    if (userExists) {
      console.log('Assigned directly to user:', assignedToId);
      // Directly assigned to a user
      userIds = [assignedToId];
    } else {
      console.log('Assigned to a team, fetching team members...');
      // Step 3: Treat `assignedTo` as a `teamId` and fetch users from TeamMember
      const teamMember = await TeamMember.findOne({ teamId: assignedToId }).populate('userIds');
      if (teamMember && teamMember.userIds && teamMember.userIds.length > 0) {
        userIds = teamMember.userIds.map((user) => user._id);
        console.log('User IDs from team:', userIds);
      } else {
        console.log('No users found for the given teamId');
        return res.status(404).json({ message: 'No users found for the given assignedTo' });
      }
    }

    console.log('User IDs to fetch progress for:', userIds);

    // Step 4: Fetch progress and user details for each userId
    const progressPromises = userIds.map(async (userId) => {
      console.log(`Fetching progress for user ${userId} and task ${taskId}`);
      const progress = await TaskProgress.findOne({ taskId, userId });
      if (progress) {
        const user = await User.findById(userId); // Fetch user details
        if (user) {
          console.log(`Progress and user details found for user ${userId}:`, progress, user);
          return {
            userId,
            username: user.username, // Include username
            progress: progress.progress,
            status: progress.status,
          };
        }
      }
      console.log(`No progress or user details found for user ${userId}`);
      return null; // If no progress or user details, skip the user
    });

    const progressStatuses = (await Promise.all(progressPromises)).filter(Boolean); // Remove nulls
    console.log('Fetched progress statuses:', progressStatuses);

    // Step 5: Return the user details along with their progress status
    if (progressStatuses.length > 0) {
      console.log('Returning progress statuses with usernames');
      return res.status(200).json({ progressStatuses });
    } else {
      console.log('No progress found for the users');
      return res.status(404).json({ message: 'No progress found for the users' });
    }
  } catch (err) {
    console.error('Error fetching user IDs and progress:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

//Task status for user to view thier task
//  async getStatusByTaskAndUser(req, res){
//   try {
//     const { taskId, userId } = req.params;

//     // Validate input
//     if (!taskId || !userId) {
//       return res.status(400).json({ error: 'taskId and userId are required' });
//     }

//     // Query the TaskProgress collection
//     const taskProgress = await TaskProgress.findOne({ taskId, userId });

//     if (!taskProgress) {
//       return res.status(404).json({ error: 'No progress found for the given taskId and userId' });
//     }

//     // Respond with the task progress and status
//     res.status(200).json({
//       taskId: taskProgress.taskId,
//       userId: taskProgress.userId,
//       status: taskProgress.status,
//       progress: taskProgress.progress,
//     });
//   } catch (error) {
//     console.error('Error fetching task progress:', error.message);
//     res.status(500).json({ error: 'Internal server error' });
//   }
 


// }

async getStatusByTaskAndUser(req, res) {
  try {
    const { taskId, userId } = req.params;

    // Validate input
    if (!taskId || !userId) {
      return res.status(400).json({ error: 'taskId and userId are required' });
    }

    // Query the TaskProgress collection
    const taskProgress = await TaskProgress.findOne({ taskId, userId });

    if (!taskProgress) {
      return res.status(404).json({ error: 'No progress found for the given taskId and userId' });
    }

    // Query the Task collection (model name is 'Task', not 'Tasks')
    const task = await Task.findById(taskId).select('-status'); // Exclude the 'status' field

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Respond with task details and progress
    res.status(200).json({
      task: {
        _id: task._id,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        assignedTo: task.assignedTo,
        createdBy: task.createdBy,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      },
      progress: {
        taskId: taskProgress.taskId,
        userId: taskProgress.userId,
        progress: taskProgress.progress,
        status:taskProgress.status
      },
    });
  } catch (error) {
    console.error('Error fetching task and progress:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}


//Task analysis for admin panel 
async  getTaskStatusAnalytics(req, res) {
  try {
    // Group tasks by status and count them
    const taskAnalytics = await Task.aggregate([
      {
        $group: {
          _id: "$status",  // Group by status (Completed, Pending, etc.)
          count: { $sum: 1 } // Count the number of tasks for each status
        }
      }
    ]);

    // If no tasks found, return an empty analytics response
    if (!taskAnalytics || taskAnalytics.length === 0) {
      return res.status(200).json({
        message: "No task status analytics available.",
        analytics: []
      });
    }

    // Prepare the response
    const analytics = taskAnalytics.reduce((acc, task) => {
      acc[task._id] = task.count; // Map each status to its count
      return acc;
    }, {});

    // Return the analytics result
    res.status(200).json({
      message: "Task status analytics fetched successfully.",
      analytics
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching task status analytics.",
      error: error.message
    });
  }
};

 


};
module.exports = new TaskController();



