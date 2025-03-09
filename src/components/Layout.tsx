import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import '../styles/components.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { logout } = useAuth();

  return (
    <div className="layout">
      {/* Sidebar */}
      <Sidebar onLogout={logout} />
      
      {/* Main Content */}
      <div className="layout-main">
        <main className="layout-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;