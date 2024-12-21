 

const express = require('express');
const http = require('http');  
const { Server } = require('socket.io');  
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const authMiddleware = require('./middlewares/authMiddleware');  
const teamnameRoutes = require('./routes/teamnameRoutes.js')
const teamMemberRoutes = require('./routes/teamMemberRoutes');
const setupSwagger = require("./config/swagger");
const connectDB = require('./config/db.js'); 
 
require('dotenv').config();  
const cors = require('cors');
// Enable CORS
const app = express();
app.use(cors());
// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',  
    methods: ['GET', 'POST'],
  },
});

// // Socket.IO event handlers
// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   socket.on('disconnect', () => {
//     console.log('A user disconnected:', socket.id);
//   });
// });


io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Example: Join user and their team rooms
  socket.on('joinRooms', ({ userId, teamId }) => {
    if (userId) {
      socket.join(userId);
      console.log(`Socket ${socket.id} joined room: ${userId}`);
    }
    if (teamId) {
      socket.join(`team_${teamId}`);
      console.log(`Socket ${socket.id} joined room: team_${teamId}`);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});



// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json()); // Body parsing middleware

// Inject io into req for later use in routes/controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/auth', authRoutes); // Auth routes (login, register)
app.use('/tasks', authMiddleware, taskRoutes); // Protect task routes with authMiddleware
app.use('/users', authMiddleware, userRoutes); // Protect user routes with authMiddleware
app.use('/teamname',authMiddleware,teamnameRoutes)
app.use('/team',authMiddleware, teamMemberRoutes);


// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});
setupSwagger(app);
// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
console.log("Swagger UI available at http://localhost:5000/api-docs");

