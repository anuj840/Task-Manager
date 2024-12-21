import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Modal, Button,  ProgressBar } from "react-bootstrap";
import Sidebar from "./sidebar";
import { Pagination } from "@mui/material";
const ViewTasks = () => {
  const [tasks, setTasks] = useState([]); // Holds the list of tasks
  const [filteredTasks, setFilteredTasks] = useState([]); // Holds the tasks after filtering
  const [searchQuery, setSearchQuery] = useState(""); // Stores the search query
  const [priorityFilter, setPriorityFilter] = useState("All"); // Holds the priority filter value
  const [message, setMessage] = useState(""); // Displays messages (success/error)
  const [currentPage, setCurrentPage] = useState(1); // Tracks the current page for pagination
  const [showModal, setShowModal] = useState(false); // Controls modal visibility
  const [progressData, setProgressData] = useState([]); // Holds task progress data
  const [loadingProgress, setLoadingProgress] = useState(false); // Indicates loading state for progress data
  const tasksPerPage = 10; // Defines how many tasks per page
  const navigate = useNavigate();

  // Format date to 'YYYY-MM-DD'
  const formatDate = (date) => {
    return new Date(date).toISOString().split("T")[0];
  };

 

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token"); // Fetches token from local storage
      if (!token) {
        setMessage("Unauthorized. Please login.");
        return; // If no token, display unauthorized message
      }
      try {
        const response = await axios.get("http://localhost:5000/tasks/user-task", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const tasks = Array.isArray(response.data.tasks) ? response.data.tasks : []; // Checks if tasks are in array format
  
        // Sort tasks by due date (or createdAt if you prefer)
        tasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate)); // Sorts in descending order (latest first)
        
        setTasks(tasks); // Sets tasks
        setFilteredTasks(tasks); // Sets filtered tasks
      } catch (error) {
        setMessage(error.response?.data?.message || "Failed to load tasks.");
      }
    };
  
    fetchTasks(); // Calls the fetch function when the component is mounted
  }, []);
  

  // Handle delete task
  const handleDelete = async (taskId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this task?"); // Confirmation for deletion
    if (!isConfirmed) return; // If not confirmed, stop further actions

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedTasks = tasks.filter((task) => task._id !== taskId); // Removes the deleted task from the list
      setTasks(updatedTasks); // Updates the tasks list
      setFilteredTasks(updatedTasks); // Updates the filtered tasks list
      setMessage("Task deleted successfully."); // Shows success message

      // Clear the message after 3 seconds
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to delete task.");
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };

  // Handle search query
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase(); // Converts the input to lowercase for case-insensitive search
    setSearchQuery(query); // Sets the search query

    const matchedTasks = tasks.filter((task) =>
      (task.title?.toLowerCase() || "").includes(query) ||
      (task.description?.toLowerCase() || "").includes(query)
    );
    setFilteredTasks(matchedTasks); // Filters tasks based on the search query
    setCurrentPage(1); // Resets to the first page after search
  };

  // Handle priority filter
  const handlePriorityFilter = (event) => {
    const selectedPriority = event.target.value; // Gets the selected priority from the dropdown
    setPriorityFilter(selectedPriority); // Sets the selected priority filter

    const filtered = tasks.filter((task) => {
      if (selectedPriority === "All") return true; // If "All" is selected, show all tasks
      return task.priority === selectedPriority; // Otherwise, filter by priority
    });
    setFilteredTasks(filtered); // Updates the filtered tasks
    setCurrentPage(1); // Resets to the first page after filtering
  };

  // Handle fetching progress data
  const handleViewProgress = async (taskId) => {
    setLoadingProgress(true); // Starts loading state for progress data
    setShowModal(true); // Opens the modal
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Unauthorized. Please login.");
        setProgressData([]); // Clears progress data if no token is found
        setLoadingProgress(false); // Ends loading state
        return;
      }
  
      const response = await axios.get(
        `http://localhost:5000/tasks/task/${taskId}/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      setProgressData(response.data.progressStatuses); // Sets the progress data fetched from the server
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to fetch progress data."
      );
      setProgressData([]); // Clears progress data on error
    } finally {
      setLoadingProgress(false); // Ends loading state
    }
  };

  // Pagination logic
  const indexOfLastTask = currentPage * tasksPerPage; // Calculates index for the last task on the current page
  const indexOfFirstTask = indexOfLastTask - tasksPerPage; // Calculates index for the first task on the current page
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask); // Slices the filtered tasks to get the current page tasks

  const handleChangePage = (event, value) => {
    setCurrentPage(value); // Updates the current page number when the page is changed
  };

  return (
    <div className="">
      <Sidebar />
      <div className="containt">
      <div className="container-fluid p-4">
        <h2 className="mb-4">Tasks Dashboard</h2>

        {/* Filter and Search Box in a single row */}
        <div className="mb-3 d-flex justify-content-between">
          {/* Priority Filter Dropdown */}
          <select
            className="form-select"
            value={priorityFilter}
            onChange={handlePriorityFilter}
            style={{ width: "250px" }}
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          {/* Search Box */}
          <input
            type="text"
            className="form-control"
            placeholder="Search tasks by title or description"
            value={searchQuery}
            onChange={handleSearch}
            style={{ width: "250px" }}
          />
        </div>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTasks.length > 0 ? (
              currentTasks.map((task) => (
                <tr key={task._id}>
                  <td>{task.title || "No Title"}</td>
                  <td>{task.description || "No Description"}</td>
                  <td>{formatDate(task.dueDate) || "No Due Date"}</td>
                  <td>{task.priority || "No Priority"}</td>
                  <td>{task.status || "No Status"}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleViewProgress(task._id)}
                    >
                      View Progress
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => navigate(`/tasks/edit/${task._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(task._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {filteredTasks.length > tasksPerPage && (
          <div className="d-flex justify-content-end mt-3">
            <Pagination
              count={Math.ceil(filteredTasks.length / tasksPerPage)}
              page={currentPage}
              onChange={handleChangePage}
              color="primary"
            />
          </div>
        )}

      
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Task Progress</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {loadingProgress ? (
      <p>Loading...</p>
    ) : progressData.length > 0 ? (
      progressData.map((progress) => (
        <div key={progress.userId}>
          <h6>{progress.username}</h6>
          <ProgressBar now={progress.progress} label={`${progress.progress}%`} />
          <p>Status: {progress.status}</p>
        </div>
      ))
    ) : (
      <p>Pending</p>  
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowModal(false)}>
      Close
    </Button>
  </Modal.Footer>
</Modal>

      </div>
    </div>
    </div>
  );
};

export default ViewTasks;
