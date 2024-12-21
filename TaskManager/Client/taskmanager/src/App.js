 



import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AddTask from "./components/add-task";
import ViewTasks from "./components/view-task";
import EditTask from "./components/EditTask";
import UsersTable from "./components/view-users";
import AddTeamName from "./components/AddTeamName";
import AddTeamMember from "./components/add-teammember";
import CustomerDashboard from "./components/CustomerDashboard";
import AdminDashboard from "./components/AdminDashboard";
import UserTasks from "./components/user-fetch-task";
import TeamList from "./components/TeamList";
import TeamMembers from './components/TeamMembers';  
import AdminAnalytics from "./components/AdminAnalytics";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome</h1>
      <button onClick={() => navigate("/login")}>Go to Login</button>
      <button onClick={() => navigate("/signup")} style={{ marginLeft: "10px" }}>
        Go to Signup
      </button>
    </div>
  );
};

const App = () => {
  const [role, setRole] = useState(""); // To manage the role after login
  const navigate = useNavigate();
  const currentUserId = 'current-user-id'; // Replace with dynamic user ID
  const receiverId = 'receiver-user-id'; // Replace with dynamic receiver ID


  // Simulate login and role assignment (this can be set after actual login logic)
  const handleLogin = (role) => {
    setRole(role); // Store the role (user, admin, manager, etc.)
    if (role === 'user') {
 
      navigate('/user/task');
    } else if (role === 'admin') {
      navigate('/admin/dashboard');
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/add-task" element={<AddTask />} />
      <Route path="/view-tasks" element={<ViewTasks />} />
      <Route path="/tasks/edit/:id" element={<EditTask />} />
      <Route path="/users" element={<UsersTable />} />
      <Route path="/add-team" element={<AddTeamName />} />
      <Route path="/add-team-member" element={<AddTeamMember />} />
      <Route path="/team-list" element={<TeamList />} />
      <Route path="/team/:teamId" element={<TeamMembers />} />
      <Route path="/analytics" element={<AdminAnalytics />} />

  
      <Route path="/user/task" element={<UserTasks />} />

       
    </Routes>
  );
};

export default App;


