import React from 'react';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>PNB Technologies</h1>
          <p className="slogan">Innovating Leave Management Solutions</p>
        </div>
        <nav>
          <a href="/leaves">My Leaves</a>
          <a href="/profile">Profile</a>
          <a href="/logout">Logout</a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* About Section */}
        <section className="about-section">
          <h2>About PNB Technologies</h2>
          <p>
            PNB Technologies is a leading provider of innovative leave management systems, designed to streamline employee workflows and enhance organizational efficiency. With over 10 years of experience, we empower businesses with cutting-edge technology and user-friendly interfaces.
          </p>
          <button className="learn-more-btn">Learn More</button>
        </section>

        {/* Dashboard Widgets */}
        <div className="dashboard-grid">
          <div className="dashboard-widget">
            <h3>Pending Leaves</h3>
            <p className="widget-value">5 Requests</p>
            <div className="widget-progress" style={{ width: '50%' }}></div>
          </div>
          <div className="dashboard-widget">
            <h3>Approved Leaves</h3>
            <p className="widget-value">10 Requests</p>
            <div className="widget-progress" style={{ width: '75%' }}></div>
          </div>
          <div className="dashboard-widget">
            <h3>Rejected Leaves</h3>
            <p className="widget-value">2 Requests</p>
            <div className="widget-progress" style={{ width: '20%' }}></div>
          </div>
        </div>

        {/* Enrollment Call-to-Action */}
        <section className="enroll-section">
          <h2>Need to Enroll?</h2>
          <p>Join PNB Technologies' leave management system today to manage your leaves efficiently. Contact HR or register now!</p>
          <button className="enroll-btn">Enroll Now</button>
        </section>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>&copy; 2025 PNB Technologies. All rights reserved.</p>
        <div className="footer-links">
          <a href="/privacy">Privacy Policy</a> | <a href="/terms">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;