import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    department: '',
    employeeId: '',
    fromDate: '',
    toDate: '',
    sortBy: 'createdAt',
    order: 'desc',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Memoize fetchLeaves with useCallback
  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const query = new URLSearchParams(filters).toString();
      const response = await fetch(`http://localhost:5000/api/leaves/admin?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setLeaves(data);
      } else {
        setError(data.message || 'Failed to fetch leaves');
      }
    } catch (error) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  }, [filters]); // Dependency on filters to re-fetch when filters change

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]); // useEffect depends on the memoized fetchLeaves

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleStatusUpdate = async (id, status, comment = '') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/leaves/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, comment }),
      });
      const data = await response.json();
      if (response.ok) {
        fetchLeaves();
      } else {
        setError(data.message || 'Failed to update leave status');
      }
    } catch (error) {
      setError('Error connecting to server');
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
          <h1>PNB Technologies - Admin Dashboard</h1>
        </div>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {error && <div className="error-message">{error}</div>}

        {/* About Section */}
        <section className="about-section">
          <div className="about-content">
            <div className="about-text">
              <h2>About Admin Dashboard</h2>
              <p>
                The Admin Dashboard by PNB Technologies empowers administrators to manage leave requests efficiently. Founded in 2015, we provide advanced tools for overseeing leave approvals, tracking, and analytics across organizations.
              </p>
              <h3>What We Do</h3>
              <p>
                Our platform offers filtering, status updates, and detailed reporting to streamline administrative tasks. Features include customizable filters, real-time updates, and multi-user access.
              </p>
              <h3>Who We Are</h3>
              <p>
                We are a team of 50+ experts—developers, HR specialists, and IT professionals—dedicated to excellence. Based in Silicon Valley, we focus on innovative solutions for business management.
              </p>
            </div>
            <div className="about-images">
              <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80" alt="Our Team" />
              <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80" alt="Admin Interface" />
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="filters-section">
          <h3>Filters</h3>
          <div className="filter-group">
            <select name="status" value={filters.status} onChange={handleFilterChange}>
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <input
              type="text"
              name="employeeId"
              placeholder="Employee ID"
              value={filters.employeeId}
              onChange={handleFilterChange}
            />
            <input
              type="text"
              name="department"
              placeholder="Department"
              value={filters.department}
              onChange={handleFilterChange}
            />
            <input
              type="date"
              name="fromDate"
              value={filters.fromDate}
              onChange={handleFilterChange}
            />
            <input
              type="date"
              name="toDate"
              value={filters.toDate}
              onChange={handleFilterChange}
            />
            <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
              <option value="createdAt">Created Date</option>
              <option value="fromDate">From Date</option>
            </select>
            <select name="order" value={filters.order} onChange={handleFilterChange}>
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
            <button onClick={fetchLeaves} className="filter-button">Apply Filters</button>
          </div>
        </section>

        {/* Leave Requests Section */}
        <section className="leave-requests">
          <h3>Leave Requests</h3>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : leaves.length === 0 ? (
            <p>No leave requests found</p>
          ) : (
            <table className="leave-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>ID</th>
                  <th>Department</th>
                  <th>Leave Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Comment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td>{leave.name}</td>
                    <td>{leave.employeeId}</td>
                    <td>{leave.department}</td>
                    <td>{leave.leaveType}</td>
                    <td>{new Date(leave.fromDate).toLocaleDateString()}</td>
                    <td>{new Date(leave.toDate).toLocaleDateString()}</td>
                    <td>{leave.reason}</td>
                    <td className={`status-${leave.status.toLowerCase()}`}>{leave.status}</td>
                    <td>{leave.comment || '-'}</td>
                    <td>
                      {leave.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => {
                              const comment = prompt('Optional comment:');
                              handleStatusUpdate(leave._id, 'Approved', comment);
                            }}
                            className="approve-button"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              const comment = prompt('Optional comment:');
                              handleStatusUpdate(leave._id, 'Rejected', comment);
                            }}
                            className="reject-button"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

export default AdminDashboard;