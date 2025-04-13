import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ employeeId: '', password: '', role: 'employee' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!credentials.employeeId || !credentials.password) {
      setError('All fields are required');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();

      if (response.ok) {
        login(data.token, data.user);
        navigate(data.user.role === 'admin' ? '/admin' : '/employee');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Error connecting to server');
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <h1>PNB Technologies</h1>
          <p className="tagline">Empowering Efficient Leave Management</p>
        </div>
        <nav>
          <a href="#about">About Us</a>
          <a href="#login">Login</a>
          <a href="/register">Register</a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Login Section */}
        <section id="login" className="login-section">
          <div className="login-split">
            {/* Admin Login */}
            <div className="login-card admin-card">
              <h2>Admin Login</h2>
              {error && <div className="error-message">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Employee ID</label>
                  <input
                    type="text"
                    name="employeeId"
                    value={credentials.employeeId}
                    onChange={handleChange}
                    placeholder="Enter Employee ID"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Enter Password"
                    required
                  />
                </div>
                <input type="hidden" name="role" value="admin" />
                <button type="submit" className="login-button">Login as Admin</button>
              </form>
            </div>

            {/* Employee Login */}
            <div className="login-card employee-card">
              <h2>Employee Login</h2>
              {error && <div className="error-message">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Employee ID</label>
                  <input
                    type="text"
                    name="employeeId"
                    value={credentials.employeeId}
                    onChange={handleChange}
                    placeholder="Enter Employee ID"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Enter Password"
                    required
                  />
                </div>
                <input type="hidden" name="role" value="employee" />
                <button type="submit" className="login-button">Login as Employee</button>
              </form>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="about-section">
          <div className="about-content">
            <div className="about-text">
              <h2>About PNB Technologies</h2>
              <p>
                PNB Technologies is a premier software solutions provider specializing in advanced leave management systems. Founded in 2015, we serve over 500 companies worldwide, offering tools to streamline leave requests, approvals, and tracking with real-time analytics.
              </p>
              <h3>What We Do</h3>
              <p>
                Our software automates leave processes, integrates with HR systems, and provides detailed reports to enhance decision-making. Features include multi-level approvals, mobile access, and customizable workflows.
              </p>
              <h3>Who We Are</h3>
              <p>
                We are a team of 50+ dedicated professionals—developers, HR experts, and customer support specialists—committed to delivering excellence. Based in Silicon Valley, we prioritize innovation and client satisfaction.
              </p>
              <button className="contact-btn">Contact Us</button>
            </div>
            <div className="about-images">
              <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80" alt="Our Team" />
              <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80" alt="Software Interface" />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 PNB Technologies. All Rights Reserved.</p>
        <div className="footer-links">
          <a href="/privacy">Privacy Policy</a> | <a href="/terms">Terms of Service</a> | <a href="/careers">Careers</a>
        </div>
      </footer>
    </div>
  );
};

export default Login;