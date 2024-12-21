

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Sidebar from './user-sidebar';
import './Tasks.css'; 
const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTaskNotification, setNewTaskNotification] = useState(null);
useEffect(() => {
  // Fetch tasks
  const fetchTasks = async () => {
    try {
      console.log('Fetching tasks from the server...');
      const token = localStorage.getItem('token');
     
      if (!token) {
        setError('No token found, please login');
        setLoading(false);
        console.error('No token found in localStorage');
        return;
      }

      // const response = await axios.get('http://localhost:5000/tasks', {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      const response = await axios.get('http://localhost:5000/tasks/fetch-user-task', {
       
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("response.data",response.data); 

      const fetchedTasks = Array.isArray(response.data.tasks) ? response.data.tasks : [];
      setTasks(fetchedTasks);
      console.log('Tasks fetched successfully:', fetchedTasks);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch tasks:', error.message || error);
      setError('Failed to fetch tasks');
      setLoading(false);
    }
  };

  fetchTasks();

  // Establish Socket.IO connection
  console.log('Establishing Socket.IO connection...');
  const socket = io('http://localhost:5000');

  const userId = localStorage.getItem('userId');
  const teamId = localStorage.getItem('teamId');
  const name = localStorage.getItem('username');
  

  console.log('userId:', userId);
  console.log('teamId:', teamId);
  console.log('name:', name);

  if (userId || teamId) {  // Proceed if either userId or teamId is available
    console.log('Joining rooms with:', { userId, teamId });
    socket.emit('joinRooms', { userId, teamId });
  } else {
    console.warn('userId or teamId not found');
  }

  socket.on('taskAdded', (task) => {
    console.log('Received taskAdded event:', task);
    setTasks((prevTasks) => [...prevTasks, task]);
    setNewTaskNotification(`New task added: ${task.title}`);

    // Clear the notification after 5 seconds
    setTimeout(() => {
      console.log('Clearing new task notification');
      setNewTaskNotification(null);
    }, 5000);
  });

  // Clean up socket connection on component unmount
  return () => {
    console.log('Disconnecting Socket.IO connection...');
    socket.disconnect();
  };
}, []);   

  

  const handleStatusChange = async (taskId, newStatus) => {
    const confirmChange = window.confirm(`Are you sure you want to change the status to "${newStatus}"?`);
    if (!confirmChange) return;

    try {
      console.log(`Updating status for taskId: ${taskId} to "${newStatus}"...`);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please login');
        console.error('No token found in localStorage');
        return;
      }

      await axios.put(`http://localhost:5000/tasks/user-tasks-update/${taskId}/status`,
        
 
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(`Status updated successfully for taskId: ${taskId}`);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
      alert('Task status updated successfully!');
    } catch (error) {
      console.error('Failed to update task status:', error.message || error);
      setError('Failed to update task status');
    }
  };

  return (
    <div className="tasks-page">
      <div className="">
        <Sidebar />
        <div className="containt">  
                <div className="container my-4">
                {newTaskNotification && (
            <div className="alert alert-info text-center mt-3">
              {newTaskNotification}
            </div>
          )}
          <h2 className="text-center mb-4">Tasks</h2>
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center">{error}</div>
          ) : (
            <div className="row">
              {tasks.length === 0 ? (
                <p className="text-center">No tasks available</p>
              ) : (
                tasks.map((task) => (
                  <div key={task._id} className="col-md-6 mb-4">
                    <div className="card shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">{task.title}</h5>
                        <p className="card-text">{task.description}</p>
                        <p>
                          <strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Status:</strong>{' '}
                          <span
                            className={`badge ${
                              task.status === 'pending'
                                ? 'bg-warning'
                                : task.status === 'in-progress'
                                ? 'bg-info'
                                : 'bg-success'
                            }`}
                          >
                            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                          </span>
                        </p>
                        <select
                          className="form-select"
                          value={task.status}
                          onChange={(e) => handleStatusChange(task._id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

           
          
        </div>
      </div>
    </div>
    </div>

  );
};

export default Tasks;
