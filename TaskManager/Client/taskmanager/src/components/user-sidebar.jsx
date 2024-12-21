import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // To navigate programmatically
import axios from "axios"; // For making logout request if needed

const Sidebar = () => {
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [userName, setUserName] = useState(''); // State to hold the user's name

  useEffect(() => {
    // Get the user's name from localStorage
    const name = localStorage.getItem("name");
    setUserName(name || "User");
  }, []);

  const handleLogout = async () => {
    try {
      // Optionally, make a request to the server to invalidate the session
      await axios.post(
        "http://localhost:5000/auth/logout",
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
    } catch (error) {
      console.error("Error during logout:", error);
    }

    // Clear the token from localStorage
    localStorage.removeItem("token");

    // Redirect to the login page
    navigate("/login");
  };

  return (
    <div
      className="user-sidebar d-flex flex-column bg-dark text-white p-3"
      style={{ width: "250px" }}
    >
      <h4 className="mb-4">Welcome, {userName}</h4> {/* Added welcome message */}
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          {/* <a href="/dashboard" className="nav-link text-white">Dashboard</a> */}
        </li>
        {/* <li className="nav-item mb-2">
          <a href="/users" className="nav-link text-white">View Task</a>
        </li> */}
        <li className="nav-item">
          {/* The Logout link now triggers handleLogout */}
          <a href="#" className="nav-link text-white" onClick={handleLogout}>
            Logout
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
