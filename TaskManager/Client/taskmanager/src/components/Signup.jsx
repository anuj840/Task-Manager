 


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
 

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user"
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/auth/register", formData);
      setMessage("Signup successful!");
      setTimeout(() => navigate("/login"), 2000); // Navigate to login page after 2 seconds
    } catch (error) {
      setMessage(error.response?.data?.message || "Signup failed. Try again.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4 rounded" style={{ width: "100%", maxWidth: "400px" }}>
        <h5 className="text-center mb-4">Welcome user, please signup here</h5>
        {message && <div className="alert alert-info text-center">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-control"
              placeholder="Your name"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              placeholder="youremail@domain.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password <span className="text-danger">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              placeholder="Your password.."
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
           
          <div className="d-grid">
            <button type="submit" className="btn btn-success rounded-pill">
              Submit
            </button>
          </div>
        </form>
        <div className="text-center mt-3">
          <a href="/login" className="text-decoration-none text-primary">
            Already have an account? Login here
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
