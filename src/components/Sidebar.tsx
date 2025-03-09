import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiBook, FiLogOut, FiMenu, FiX, FiHelpCircle } from 'react-icons/fi';
import '../styles/components.css';

interface SidebarProps {
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [currentHelpStep, setCurrentHelpStep] = useState(0);

  // Check if current path matches the link
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const openHelpModal = () => {
    setIsHelpModalOpen(true);
    setCurrentHelpStep(0);
  };

  const closeHelpModal = () => {
    setIsHelpModalOpen(false);
  };

  const nextHelpStep = () => {
    if (currentHelpStep < helpSteps.length - 1) {
      setCurrentHelpStep(currentHelpStep + 1);
    } else {
      closeHelpModal();
    }
  };

  const prevHelpStep = () => {
    if (currentHelpStep > 0) {
      setCurrentHelpStep(currentHelpStep - 1);
    }
  };

  // Help steps content
  const helpSteps = [
    {
      title: "Welcome to fiscus.",
      content: "This guide will help you understand how to use the dashboard and transaction pages effectively."
    },
    {
      title: "Portfolio Dashboard",
      content: "The Portfolio page gives you a complete overview of your financial status. You'll see your account balances, recent transactions, and analytics of your spending patterns."
    },
    {
      title: "Ledger Page",
      content: "The Ledger page lists all your transactions. You can filter by date, category, or amount. Click on any transaction to see more details or edit it."
    },
    {
      title: "Adding Transactions",
      content: "To add a new transaction, go to the Ledger page and click the '+' button in the bottom right corner. Fill in the details and save to record your transaction."
    },
    {
      title: "That's it!",
      content: "You're all set to use fiscus. If you have any more questions, click the Help button anytime."
    }
  ];

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
            <li>
              <button
                className="sidebar-nav-link"
                onClick={() => {
                  openHelpModal();
                  setIsMobileMenuOpen(false);
                }}
              >
                <FiHelpCircle className="sidebar-nav-link-icon" />
                <span>Help</span>
              </button>
            </li>
          </ul>
        </nav>
        {/* Spacer to push logout to bottom */}
          <div className="sidebar-spacer"></div>

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

      {/* Help Modal */}
      {isHelpModalOpen && (
        <div className="modal-overlay">
          <div className="help-modal">
            <div className="help-modal-header">
              <h2>{helpSteps[currentHelpStep].title}</h2>
              <button onClick={closeHelpModal} className="modal-close-btn">
                <FiX size={20} />
              </button>
            </div>
            <div className="help-modal-content">
              <p>{helpSteps[currentHelpStep].content}</p>
            </div>
            <div className="help-modal-footer">
              <div className="step-indicator">
                {helpSteps.map((_, index) => (
                  <div 
                    key={index} 
                    className={`step-dot ${index === currentHelpStep ? 'active' : ''}`}
                    onClick={() => setCurrentHelpStep(index)}
                  />
                ))}
              </div>
              <div className="modal-buttons">
                <button 
                  onClick={prevHelpStep} 
                  className="modal-btn"
                  disabled={currentHelpStep === 0}
                >
                  Previous
                </button>
                <button onClick={nextHelpStep} className="modal-btn primary">
                  {currentHelpStep === helpSteps.length - 1 ? 'Finish' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;