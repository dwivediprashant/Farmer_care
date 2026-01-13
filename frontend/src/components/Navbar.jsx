import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { isAuthenticated, removeToken } from '../utils/auth';
import { useTheme } from '../context/ThemeContext';
import AlertToast from './AlertToast';

const Navbar = ({ handleProtectedClick }) => {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  
  const handleLogout = () => {
    removeToken();
    window.location.href = '/';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark custom-navbar fixed-top">
      <div className="container-fluid px-4">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img src="/logo.jpeg" alt="NeoKrishi" height="40" className="rounded" style={{backgroundColor: 'white', padding: '4px'}} />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={handleProtectedClick}>
                <i className="fas fa-home me-2"></i>
                <span>Home</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/news" className={`nav-link ${location.pathname === '/news' ? 'active' : ''}`} onClick={handleProtectedClick}>
                <i className="fas fa-newspaper me-2"></i>
                <span>News & Schemes</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/market" className={`nav-link ${location.pathname === '/market' ? 'active' : ''}`} onClick={handleProtectedClick}>
                <i className="fas fa-chart-line me-2"></i>
                <span>Market</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/crop-recommendation" className={`nav-link ${location.pathname === '/crop-recommendation' ? 'active' : ''}`} onClick={handleProtectedClick}>
                <i className="fas fa-leaf me-2"></i>
                <span>Crops</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/detect-disease" className={`nav-link ${location.pathname === '/detect-disease' ? 'active' : ''}`} onClick={handleProtectedClick}>
                <i className="fas fa-microscope me-2"></i>
                <span>Disease</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/community" className={`nav-link ${location.pathname === '/community' ? 'active' : ''}`} onClick={handleProtectedClick}>
                <i className="fas fa-users me-2"></i>
                <span>Community</span>
              </Link>
            </li>
            <li className="nav-item d-flex align-items-center me-3">
              <i className="fas fa-sun text-warning me-2"></i>
              <div className="form-check form-switch">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="themeSwitch"
                  checked={isDark}
                  onChange={toggleTheme}
                />
                <label className="form-check-label visually-hidden" htmlFor="themeSwitch">
                  Toggle theme
                </label>
              </div>
              <i className="fas fa-moon text-info ms-2"></i>
            </li>
            {isAuthenticated() ? (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="fas fa-user-circle me-2"></i>
                  <span>Account</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link to="/profile" className="dropdown-item" onClick={handleProtectedClick}>
                      <i className="fas fa-user me-2"></i>Profile
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button onClick={handleLogout} className="dropdown-item">
                      <i className="fas fa-sign-out-alt me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  <i className="fas fa-sign-in-alt me-2"></i>
                  <span>Login</span>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;