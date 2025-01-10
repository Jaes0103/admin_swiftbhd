import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaFileAlt, FaHeart, FaPaw, FaCalendarAlt, FaUsers, FaSignOutAlt, FaMap, FaChevronDown } from 'react-icons/fa';

import '../style/Sidebar.css';
import ConfirmationModal from './ConfirmationModal';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isReportsExpanded, setReportsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setModalOpen(true);
  };

  const confirmLogout = () => {
    logout();
    navigate('/');
    alert("Successfully logged out!");
  };

  const cancelLogout = () => {
    setModalOpen(false);
  };

  const toggleReportsSubmenu = () => {
    setReportsExpanded(!isReportsExpanded);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Admin</h2>
      </div>
      <ul className="sidebar-list">
        <li>
          <NavLink to="/dashboard" className="sidebar-link" activeClassName="active">
            <FaTachometerAlt className="sidebar-icon" /> Dashboard
          </NavLink>
        </li>
        <li>
          <button
            className={`sidebar-link dropdown-toggle ${isReportsExpanded ? 'active' : ''}`}
            onClick={toggleReportsSubmenu}
          >
            <FaFileAlt className="sidebar-icon" /> Reports
            <FaChevronDown className={`dropdown-icon ${isReportsExpanded ? 'rotated' : ''}`} />
          </button>
          {isReportsExpanded && (
            <ul className="submenu">
              <li>
                <NavLink to="/reports/pending-rescue" className="sidebar-link" activeClassName="active">
                  Pending Rescue
                </NavLink>
              </li>
              <li>
                <NavLink to="/reports/rescued" className="sidebar-link" activeClassName="active">
                  Rescued
                </NavLink>
              </li>
              <li>
                <NavLink to="/reports/false-reports" className="sidebar-link" activeClassName="active">
                  False Reports
                </NavLink>
              </li>
            </ul>
          )}
        </li>
        <li>
          <NavLink to="/adopt-animal" className="sidebar-link" activeClassName="active">
            <FaHeart className="sidebar-icon" /> Adoptions
          </NavLink>
        </li>
        <li>
          <NavLink to="/animals" className="sidebar-link" activeClassName="active">
            <FaPaw className="sidebar-icon" /> Animals
          </NavLink>
        </li>
        <li>
          <NavLink to="/events" className="sidebar-link" activeClassName="active">
            <FaCalendarAlt className="sidebar-icon" /> Events
          </NavLink>
        </li>
        <li>
          <NavLink to="/rescuers" className="sidebar-link" activeClassName="active">
            <FaUsers className="sidebar-icon" /> Rescuers
          </NavLink>
        </li>
        <li>
          <NavLink to="/maps" className="sidebar-link" activeClassName="active">
            <FaMap className="sidebar-icon" /> Map
          </NavLink>
        </li>
      </ul>
      <div className="sidebar-footer">
        <button onClick={handleLogoutClick} className="sidebar-link logout-button">
          <FaSignOutAlt className="sidebar-icon" /> Logout
        </button>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        message="Are you sure you want to log out?"
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </div>
  );
};

export default Sidebar;
