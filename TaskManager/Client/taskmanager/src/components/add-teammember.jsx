import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from "./sidebar";

const AddTeamMember = () => {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeamsAndUsers = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch users
        const userResponse = await axios.get('http://localhost:5000/auth/users', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filter users to only include those with role 'user'
        const fetchedUsers = userResponse.data?.users.filter(user => user.role === 'user') || [];
        setUsers(fetchedUsers);

        // Fetch teams
        const teamResponse = await axios.get('http://localhost:5000/teamname/teams', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTeams(teamResponse.data || []); // Ensure teams are set as an array
      } catch (err) {
        console.error('Error fetching teams or users:', err);
        setError('Failed to load teams or users. Please try again later.');
      }
    };

    fetchTeamsAndUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token not found. Please login.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/team/teammembers',
        { teamId: selectedTeam, userIds: selectedUsers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setMessage(response.data.message || 'Team member(s) added successfully!');
      // Reset fields after 3 seconds
      setTimeout(() => {
        setSelectedTeam('');
        setSelectedUsers([]);
        setMessage('');
      }, 3000); // Reset after 3 seconds
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Server error occurred');
      } else {
        setError('Error connecting to the server');
      }
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setSelectedUsers((prevSelectedUsers) =>
      checked
        ? [...prevSelectedUsers, value]
        : prevSelectedUsers.filter((userId) => userId !== value)
    );
  };

  return (
    <div className="">

      <Sidebar />
      <div className="containt">
      <div className="container mt-5">
        <h2>Add Team Member</h2>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          {/* Dropdown for Teams */}
          <div className="mb-3">
            <label htmlFor="team" className="form-label">
              Select Team
            </label>
            <select
              id="team"
              className="form-select"
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              required
            >
              <option value="">Select a team</option>
              {Array.isArray(teams) &&
                teams.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Checkbox list for Users */}
          <div className="mb-3">
            <label className="form-label">Select User(s)</label>
            <div>
              {Array.isArray(users) &&
                users.map((user) => (
                  <div key={user._id} className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`user-${user._id}`}
                      value={user._id}
                      onChange={handleCheckboxChange}
                      checked={selectedUsers.includes(user._id)}
                    />
                    <label className="form-check-label" htmlFor={`user-${user._id}`}>
                      {user.username} ({user.email})
                    </label>
                  </div>
                ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Add Member(s)
          </button>
        </form>
      </div>
      </div>
     
    </div>
  );
};

export default AddTeamMember;
