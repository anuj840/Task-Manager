import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./sidebar";

const AddTask = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    status: "Pending",
    assigneeType: "user", // New field to specify assignment type
    assigneeId: "", // Store the selected user's or team's ID
  });
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]); // Store the list of teams
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUsersAndTeams = async () => {
      try {
        const token = localStorage.getItem("token"); // Get the token from localStorage
  
        // Fetch users
        const userResponse = await axios.get("http://localhost:5000/auth/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const filteredUsers = userResponse.data.users.filter(
          (user) => user.role !== "admin" && user.role !== "manager"
        );
        setUsers(filteredUsers);
  
        // Fetch teams
        const teamResponse = await axios.get(
          "http://localhost:5000/teamname/teams",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTeams(teamResponse.data);
      } catch (error) {
        console.error("Error fetching users or teams:", error);
      }
    };
    fetchUsersAndTeams();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAssigneeChange = (e) => {
    const selectedId = e.target.value;
    const selectedTeam = teams.find((team) => team._id === selectedId);
  
    if (selectedTeam) {
      console.log("Selected Team _id:", selectedTeam._id); // Log only the selected team's _id
    }
  
    // Optionally, update formData with the selected team ID
    setFormData({
      ...formData,
      assigneeId: selectedId,
    });
  };
  
   



  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
  
    try {
      // Only send the assigneeId with either user or team depending on assigneeType
      const response = await axios.post(
        "http://localhost:5000/tasks/",
        {
          title: formData.title,
          description: formData.description,
          dueDate: formData.dueDate,
          priority: formData.priority,
          status: formData.status,
          // Send userId or teamId based on assigneeType
          userId: formData.assigneeType === "user" ? formData.assigneeId : null,
          teamId: formData.assigneeType === "team" ? formData.assigneeId : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Task added successfully!");
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        priority: "Medium",
        status: "Pending",
        assigneeType: "user",
        assigneeId: "",
      });
   
    // Clear the message after 3 seconds
    setTimeout(() => setMessage(""), 3000);
  } catch (error) {
    setMessage(error.response?.data?.message || "Failed to add task. Try again.");

    // Clear the error message after 3 seconds
    setTimeout(() => setMessage(""), 3000);
  }
};

  return (
    <div className="">
      <Sidebar />
<div className="containt">
      <div className="container-fluid p-4">
        <h3 className="text-center mb-4">Add New Task</h3>
        {message && (
          <div
            className={`alert ${
              message.includes("successfully") ? "alert-success" : "alert-danger"
            } text-center`}
          >
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
          {/* Assignment Type Selection */}
          <div className="mb-3">
            <label htmlFor="assigneeType" className="form-label">
              Assign To <span className="text-danger">*</span>
            </label>
            <select
              id="assigneeType"
              name="assigneeType"
              className="form-select"
              value={formData.assigneeType}
              onChange={handleChange}
              required
            >
              <option value="user">User</option>
              <option value="team">Team</option>
            </select>
          </div>

          
          <div className="mb-3">
  <label htmlFor="assigneeId" className="form-label">
    Select {formData.assigneeType === "user" ? "User" : "Team"}{" "}
    <span className="text-danger">*</span>
  </label>
  <select
    id="assigneeId"
    name="assigneeId"
    className="form-select"
    value={formData.assigneeId}
    onChange={handleAssigneeChange} // Handle change event
    required
  >
    <option value="">
      Select {formData.assigneeType === "user" ? "User" : "Team"}
    </option>
    {formData.assigneeType === "user"
      ? users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.username || user.email}
          </option>
        ))
      : teams.map((team) => (
          <option key={team._id} value={team._id}>
            {team.name}
          </option>
        ))}
  </select>
</div>


          {/* Other Task Details */}
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description <span className="text-danger">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="dueDate" className="form-label">
              Due Date <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              className="form-control"
              value={formData.dueDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="priority" className="form-label">
              Priority <span className="text-danger">*</span>
            </label>
            <select
              id="priority"
              name="priority"
              className="form-select"
              value={formData.priority}
              onChange={handleChange}
              required
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
           
          <div className="d-grid">
            <button type="submit" className="btn btn-success rounded-pill">
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default AddTask;
