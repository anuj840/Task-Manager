import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./sidebar";

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState({});
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  useEffect(() => {
    const fetchTask = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`http://localhost:5000/tasks/user-task/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched Task:", response.data.task);
        setTask(response.data.task);
      } catch (error) {
        setMessage(error.response?.data?.message || "Failed to load task.");
      }
    };

    fetchTask();
  }, [id]);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:5000/tasks/${id}`,
        task,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/view-tasks");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to save task.");
    }
  };

  // Handle the confirmation to save the task
  const handleConfirmSave = () => {
    setShowModal(false); // Close the modal
    handleSave(); // Proceed with the save action
  };

  return (
    <div className="">
      <Sidebar /> {/* Import and use Sidebar here */}
      <div className="containt">
      <div className="container-fluid p-4">
        <h2>Edit Task</h2>
        {message && <div className="alert alert-danger">{message}</div>}
        <form>
          <div>
            <label>Title:</label>
            <input
              type="text"
              className="form-control"
              value={task.title || ""}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
            />
          </div>
          <div>
            <label>Description:</label>
            <textarea
              className="form-control"
              value={task.description || ""}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
            />
          </div>
          <div>
            <label>Due Date:</label>
            <input
              type="date"
              className="form-control"
              value={task.dueDate?.split("T")[0] || ""}
              onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
            />
          </div>
          <div>
            <label>Priority:</label>
            <select
              className="form-control"
              value={task.priority || ""}
              onChange={(e) => setTask({ ...task, priority: e.target.value })}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div>
            <label>Status:</label>
            <select
              className="form-control"
              value={task.status || ""}
              onChange={(e) => setTask({ ...task, status: e.target.value })}
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <button
            type="button"
            className="btn btn-primary mt-3"
            onClick={() => setShowModal(true)} // Show modal on Save button click
          >
            Save
          </button>
        </form>
      </div>
      </div>
      {/* Confirmation Modal */}
      {showModal && (
  <div className="modal" style={{ display: "block" }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Confirm Update</h5>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to update this task?</p>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowModal(false)} // Close the modal
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleConfirmSave} // Confirm and save
          >
            Yes, Save
          </button>
        </div>
      </div>
    </div>
  </div>

)}

    </div>
  
  );
};

export default EditTask;
    