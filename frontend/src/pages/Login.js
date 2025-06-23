import React, { useState,useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import { UserContext } from "../context/UserContext";
function Login() {
  const { setUser } = useContext(UserContext); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/login', { email, password });
      const { user } = res.data; // Assume server sends user info
      setUser(user); // Update global user state
      alert("Login successful!");
      navigate("/products"); // Redirect after login
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <center><br/><br/><br/><br/><div className="login-container">
      <div className="login-box">
        <h1 className="store-name">TechGadget Store</h1>
        <h2>Welcome Back</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="text"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn-submit">Login</button>
        </form>
        <p className="signup-link">
          Don't have an account? <Link to="/signup">Signup</Link>
        </p>
      </div>
    </div></center>
  );
}

export default Login;
