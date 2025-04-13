import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [leaveForm, setLeaveForm] = useState({
    leaveType: '',
    fromDate: '',
    toDate: '',
    reason: '',
  });
  const [error, setError] = useState('');
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/leaves/employee', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setLeaves(data);
      } else {
        setError(data.message || 'Failed to fetch leaves');
      }
    } catch (error) {
      setError('Error fetching leaves');
    }
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/leaves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(leaveForm),
      });
      const data = await response.json();
      if (response.ok) {
        setLeaveForm({ leaveType: '', fromDate: '', toDate: '', reason: '' });
        fetchLeaves();
      } else {
        setError(data.message || 'Failed to apply leave');
      }
    } catch (error) {
      setError('Error applying leave');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>PNB Technologies - Employee Dashboard</h1>
          <p className="welcome">Welcome, {user?.name}</p>
        </div>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {error && <div className="error-message">{error}</div>}

        {/* About Section */}
        <section className="about-section">
          <h2>About Your Dashboard</h2>
          <p>
            This dashboard, powered by PNB Technologies, allows you to manage your leave requests efficiently. Our software integrates seamlessly with your HR system, providing real-time updates and a user-friendly interface tailored for employees.
          </p>
          <p>
            Founded in 2015, PNB Technologies serves hundreds of organizations, ensuring streamlined leave processes with features like multi-level approvals and detailed tracking.
          </p>
        </section>

        {/* Leave Application Section */}
        <section className="leave-section">
          <h3>Apply for Leave</h3>
          <form onSubmit={handleLeaveSubmit} className="leave-form">
            <div className="form-group">
              <label>Leave Type</label>
              <select
                name="leaveType"
                value={leaveForm.leaveType}
                onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
                required
              >
                <option value="">Select Type</option>
                <option value="Casual">Casual</option>
                <option value="Sick">Sick</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>
            <div className="form-group">
              <label>From Date</label>
              <input
                type="date"
                value={leaveForm.fromDate}
                onChange={(e) => setLeaveForm({ ...leaveForm, fromDate: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>To Date</label>
              <input
                type="date"
                value={leaveForm.toDate}
                onChange={(e) => setLeaveForm({ ...leaveForm, toDate: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Reason</label>
              <input
                type="text"
                value={leaveForm.reason}
                onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="submit-button">Apply Leave</button>
          </form>
        </section>

        {/* Leave Requests Section */}
        <section className="leave-requests">
          <h3>My Leave Requests</h3>
          {leaves.length > 0 ? (
            <table className="leave-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td>{leave.leaveType}</td>
                    <td>{new Date(leave.fromDate).toLocaleDateString()}</td>
                    <td>{new Date(leave.toDate).toLocaleDateString()}</td>
                    <td>{leave.reason}</td>
                    <td>{leave.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No leave requests found.</p>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>© 2025 PNB Technologies. All Rights Reserved.</p>
        <div className="footer-links">
          <a href="/privacy">Privacy Policy</a> | <a href="/terms">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};

export default EmployeeDashboard;