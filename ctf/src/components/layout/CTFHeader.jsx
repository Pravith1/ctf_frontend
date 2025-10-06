import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './CTFHeader.css';

export default function CTFHeader() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="ctf-header">
      <div className="ctf-header-container">
        {/* Logo/Brand */}
        <div className="ctf-brand">
          <Link to="/leaderboard" className="brand-link">
            <span className="brand-text">CYBERCTF</span>
          </Link>
        </div>
      </div>
      <div>
        {/* Navigation Links */}
        <nav className="ctf-nav">
          <Link to="/challenge" className="nav-link">
            Challenges
          </Link>
          <Link to="/leaderboard" className="nav-link">
            Scoreboard
          </Link>
          {isAdmin() && (
            <Link to="/admin" className="nav-link">
              Dashboard
            </Link>
          )}
          
        </nav>
      </div>
    </header>
  );
}