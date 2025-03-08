import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiBook, FiLogOut } from 'react-icons/fi';

interface SidebarProps {
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const location = useLocation();
  
  // Check if current path matches the link
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="h-screen w-[20vw] flex flex-col bg-[var(--color-darkgreen)] text-[var(--color-white)] shadow-lg">
      {/* Logo */}
      <div className="p-6 flex items-center">
        <div className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'Fraunces' }}>fiscus.</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link 
              to="/portfolio" 
              className={`[var(--color-darkgreen)] flex items-center p-3 rounded-lg transition-colors ${
                isActive('/portfolio') 
                  ? 'bg-[var(--color-pistachio)] text-[var(--color-darkgreen)]' 
                  : 'text-[var(--color-white)] hover:bg-[var(--color-pistachio)] hover:text-[var(--color-darkgreen)]'
              }`}
            >
              <FiHome className="mr-3" />
              <span>Portfolio</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/ledger" 
              className={`text-[var(--color-darkgreen)] flex items-center p-3 rounded-lg transition-colors ${
                isActive('/ledger') 
                  ? 'bg-[var(--color-pistachio)] text-[var(--color-darkgreen)]' 
                  : 'text-[var(--color-white)] hover:bg-[var(--color-pistachio)] hover:text-[var(--color-darkgreen)]'
              }`}
            >
              <FiBook className="mr-3" />
              <span>Ledger</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4">
        <button 
          onClick={onLogout} 
          className="w-full flex items-center p-3 rounded-lg text-[var(--color-white)] hover:bg-[var(--color-pistachio)] hover:text-[var(--color-darkgreen)] transition-colors"
        >
          <FiLogOut className="mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;