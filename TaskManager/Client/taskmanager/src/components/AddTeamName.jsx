import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from "./sidebar";

const AddTeamName = () => {
  const [teamName, setTeamName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const token = localStorage.getItem('token');

    console.log('Token:', token); // Debug to verify token presence

    if (!token) {
      setError('Authentication token not found. Please login.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/teamname/teams',
        { name: teamName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const createdTeamName = response.data?.team?.name || teamName;

      setMessage(`Team "${createdTeamName}" created successfully!`);
      
      // Clear the team name field after success
      setTimeout(() => {
        setTeamName('');
        setMessage(''); // Optionally clear the success message after 3 seconds
      }, 3000);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Server error');
      } else {
        setError('Error connecting to the server');
      }
    }
  };

  return (
    <div className="">
      <Sidebar />
      <div className="containt">

      
    <div className="container mt-5">
      <h2>Add a New Team</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="teamName" className="form-label">
            Team Name
          </label>
          <input
            type="text"
            id="teamName"
            className="form-control"
            placeholder="Enter team name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Create Team
        </button>
      </form>
    </div>
    </div>
    </div>
  );
};

export default AddTeamName;
