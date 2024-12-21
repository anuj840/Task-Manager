import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './sidebar';
import axios from 'axios';

const TeamMembers = () => {
  const { teamId } = useParams(); // Get the teamId from the URL
  const [teamDetails, setTeamDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/team/teammembers/${teamId}/members`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setTeamDetails(response.data);
      } catch (error) {
        console.error('Error fetching team members:', error);
        setTeamDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [teamId]);

  if (loading) return <p>Loading...</p>;
  if (!teamDetails) return <p>No team members found or there was an error fetching the details.</p>;

  return (
 
        <div className="containt">
      <Sidebar />
    <div className="container mt-4">
      <h3>{teamDetails.team.name}</h3>
      {/* <h4>Team ID: {teamDetails.team.id}</h4> */}
      {/* <h5>Members:</h5> */}
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Sr.no</th>
            <th>Username</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {teamDetails.members.map((member, index) => (
            <tr key={member._id}>
              <td>{index + 1}</td>
              <td>{member.username}</td>
              <td>{member.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
 
  );
};

export default TeamMembers;
