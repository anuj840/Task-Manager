import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './sidebar';

const TeamList = () => {
  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false); // For delete modal
  const [showEditModal, setShowEditModal] = useState(false); // For edit modal
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [teamId, setTeamId] = useState(null); // Store teamId to delete or edit specific team
  const [teamName, setTeamName] = useState(''); // Store team name for editing
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get('http://localhost:5000/teamname/teams', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setTeams(response.data);
      } catch (error) {
        console.error('Failed to fetch teams:', error);
      }
    };

    fetchTeams();
  }, []);

  const handleDeleteClick = (id) => {
    setTeamId(id); // Set the teamId to delete
    setShowModal(true); // Show the delete modal
  };

  const handleCancelDelete = () => {
    setShowModal(false); // Close the delete modal without deleting
  };

  const handleConfirmDelete = async () => {
    if (!teamId) return;
  
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:5000/teamname/teams/${teamId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Handle success
      alert('Team deleted successfully');
      setShowModal(false);
      // Remove deleted team from the state
      setTeams((prevTeams) => prevTeams.filter((team) => team._id !== teamId));
    } catch (err) {
      setError('Failed to delete the team');
      console.error('Error deleting team:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMembers = (teamId) => {
    navigate(`/team/${teamId}`);
  };

  const handleEditClick = async (id) => {
    setTeamId(id); // Set the teamId to edit
    try {
      const response = await axios.get(`http://localhost:5000/teamname/teams/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTeamName(response.data.name); // Prefill the team name for editing
      setShowEditModal(true); // Show the edit modal
    } catch (error) {
      console.error('Failed to fetch team details:', error);
    }
  };

  const handleUpdateTeam = async () => {
    if (!teamName) return;

    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:5000/teamname/teams/${teamId}`,
        { name: teamName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      // Handle success
      alert('Team updated successfully');
      setTeams((prevTeams) =>
        prevTeams.map((team) =>
          team._id === teamId ? { ...team, name: teamName } : team
        )
      );
      setTeamName('');
      setTeamId(null);
      setShowEditModal(false); // Close edit modal
    } catch (err) {
      setError('Failed to update the team');
      console.error('Error updating team:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Sidebar />
      <div className="containt">
        <h2 className="text-center mb-4">Teams</h2>
        <div className="table-responsive">
          <table className="table table-bordered table-hover table-striped">
            <thead className="table-dark">
              <tr>
                <th scope="col">Team Name</th>
                <th scope="col">Created Date</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team._id}>
                  <td>{team.name}</td>
                  <td>{new Date(team.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm  me-3"
                      onClick={() => handleViewMembers(team._id)}
                    >
                      View Members
                    </button>
                    <button
                      className="btn btn-warning btn-sm me-3"
                      onClick={() => handleEditClick(team._id)}
                    >
                      Edit Team Name
                    </button>
                    <button
                      className="btn btn-danger btn-sm me-3"
                      onClick={() => handleDeleteClick(team._id)}
                    >
                      Delete Team
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Delete Modal */}
        {showModal && (
          <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }} aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Delete</h5>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete this team?</p>
                  {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
                <div className="modal-footer">
                  <button onClick={handleCancelDelete} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="btn btn-danger"
                    disabled={loading}
                  >
                    {loading ? 'Deleting...' : 'Delete Team'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && (
          <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }} aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Team Name</h5>
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="form-control"
                    placeholder="Enter new team name"
                  />
                  {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
                <div className="modal-footer">
                  <button onClick={() => setShowEditModal(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateTeam}
                    className="btn btn-success"
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update Team'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamList;
