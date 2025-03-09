import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiBook, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import '../styles/components.css';

interface SidebarProps {
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Check if current path matches the link
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="mobile-menu-btn"
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-text">fiscus.</div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <ul className="sidebar-nav-list">
            <li>
              <Link 
                to="/portfolio" 
                className={`sidebar-nav-link ${isActive('/portfolio') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FiHome className="sidebar-nav-link-icon" />
                <span>Portfolio</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/ledger" 
                className={`sidebar-nav-link ${isActive('/ledger') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FiBook className="sidebar-nav-link-icon" />
                <span>Ledger</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="sidebar-footer">
          <button 
            onClick={() => {
              onLogout?.();
              setIsMobileMenuOpen(false);
            }}
            className="sidebar-logout-btn"
          >
            <FiLogOut className="sidebar-nav-link-icon" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;