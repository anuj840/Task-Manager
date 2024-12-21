import React from "react";
import { useNavigate } from "react-router-dom"; // To navigate programmatically
import axios from "axios"; // For making logout request if needed

const Sidebar = () => {
  const navigate = useNavigate(); // Hook to navigate programmatically

  const handleLogout = async () => {
    // Optionally, make a request to the server to invalidate the session
    try {
      // If your server handles logout, you can call an API to invalidate the session.
      // If not, you can just clear the token
      await axios.post("http://localhost:5000/auth/user-logout", {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
    } catch (error) {
      console.error("Error during logout:", error);
    }

    // Clear the token from localStorage (or sessionStorage)
    localStorage.removeItem("token");

    // Redirect to the login page
    navigate("/login");
  };

  return (
    <div className="sidebar d-flex flex-column bg-dark text-white p-3">
      <h4 className="mb-4">Admin Panel</h4>
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <a href="/analytics" className="nav-link text-white">Dashboard</a>
        </li>
        <li className="nav-item mb-2">
          <a href="/users" className="nav-link text-white">View Users</a>
        </li>
        <li className="nav-item mb-2">
          <a href="/add-team" className="nav-link text-white">Add Team </a>
        </li>
        <li className="nav-item mb-2">
          <a href="/add-team-member" className="nav-link text-white">Add Team Member</a>
        </li>
        <li className="nav-item mb-2">
          <a href="/team-list" className="nav-link text-white">View Team & Members</a>
        </li>
        <li className="nav-item mb-2">
          <a href="/add-task" className="nav-link text-white">Add Task</a>
        </li>
        <li className="nav-item mb-2">
          <a href="/view-tasks" className="nav-link text-white">View Tasks</a>
        </li>
      
        <li className="nav-item">
          {/* The Logout link now triggers handleLogout */}
          <a href="#" className="nav-link text-white" onClick={handleLogout}>Logout</a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
