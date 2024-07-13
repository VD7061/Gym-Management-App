import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

const Dashboard = () => {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <nav>
        <Link to="/addmember">Add Member</Link>
        <Link to="/members">View Members</Link>
        <button onClick={logout}>Logout</button>
      </nav>

      <div className="dashboard-content">
        <h3>Welcome to Your Gym Management System!</h3>
        <p>Here you can manage all your gym members, track payments, and more.</p>

        <h4>Quick Links:</h4>
        <ul>
          <li>
            <Link to="/addmember">Add New Member</Link>
          </li>
          <li>
            <Link to="/members">View All Members</Link>
          </li>
          <li>
            <Link to="/payments">Manage Payments</Link>
          </li>
        </ul>

        <h4>Statistics:</h4>
        <div className="stats">
          <p>Total Members: <strong>100</strong></p>
          <p>Active Members: <strong>80</strong></p>
          <p>Pending Payments: <strong>20</strong></p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
