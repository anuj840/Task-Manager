 


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router's hook to navigate
import axios from 'axios'; // To make the API call

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [retryAfter, setRetryAfter] = useState(null); // To store the retry time
  const navigate = useNavigate(); // Hook to navigate programmatically

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/auth/login', { email, password });

      // Assuming you receive user data and JWT token after login
      const { user, token } = response.data;

      // Store the token (for example, in localStorage or context)
      localStorage.setItem('token', token);
      // Store userId and role in localStorage
    localStorage.setItem('userId', user.id);  // Store the userId
    localStorage.setItem('role', user.role);   // Store the role (user, admin, etc.)
    localStorage.setItem('name',user.username)
     
      // Check the user role and navigate accordingly
      if (user.role === 'user') {
        navigate('/user/task');
      } else if (['admin', 'manager'].includes(user.role)) {
        navigate('/add-task');
      }
    } catch (error) {
      if (error.response && error.response.status === 429) {
        // Handle rate-limited response
        const { message, retryAfter } = error.response.data;
        setMessage(`${message} Try again in ${retryAfter} minutes.`);
        setRetryAfter(retryAfter);
      } else {
        // Handle other errors
        setMessage('Login failed. Please check your credentials.');
      }
      console.error('Login failed', error);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px" }}>
        <h5 className="text-center mb-4">Welcome user, please login here</h5>
        {message && <div className="alert alert-info text-center">{message}</div>}
        <form onSubmit={handleLogin}>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-success">
              Submit
            </button>
          </div>
        </form>
        <div className="text-center mt-3">
          <a href="/signup" className="text-decoration-none">
            Don’t have an account? Signup here
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
