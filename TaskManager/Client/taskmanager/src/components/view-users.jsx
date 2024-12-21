import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import Sidebar from './sidebar';
import { Pagination } from "@mui/material";
import './Tasks.css'; 
import './Style.css';


const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10; // Display 10 users per page

  useEffect(() => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');

    // Fetch users from the API with the token
    axios.get('http://localhost:5000/auth/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => {
        // Filter out users with the username 'admin'
        const filteredUsers = response.data.users.filter(user => user.username.toLowerCase() !== 'admin');
        setUsers(filteredUsers);
        setTotalUsers(filteredUsers.length);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const indexOfLastUser = currentPage * tasksPerPage;
  const indexOfFirstUser = indexOfLastUser - tasksPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="">
      <Sidebar />
      <div className="containt" >
      <div className="container">
        <h1 className="my-4">Users List</h1>
        {/* <p>Total Users: {totalUsers}</p> */}

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map(user => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No users found</td>
              </tr>
            )}
          </tbody>
        </Table>

        <div className="d-flex justify-content-end mt-3">
          <Pagination
            count={Math.ceil(totalUsers / tasksPerPage)}
            page={currentPage}
            onChange={handleChangePage}
            color="primary"
            className="mt-4"
          />
        </div>  
      </div>
      </div>
    </div>
  );
};

export default UsersTable;
