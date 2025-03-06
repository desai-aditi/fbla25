import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar onLogout={logout} />
      
      {/* Main Content */}
      <div className="pageflex w-[80vw]">
        <main className="h-full w-full max-h-screen p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;