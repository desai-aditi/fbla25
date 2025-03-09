import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { FiHome, FiBook, FiSettings, FiLogOut, FiMenu, FiX, FiInfo, FiStar, FiUser, FiUserPlus } from 'react-icons/fi';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-[#1B4332] to-[#184E77] text-white shadow-md font-['Libre_Franklin']">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-['Fraunces'] font-bold flex items-center">
          <span className="text-white">fiscus.</span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="flex items-center hover:text-[#40916C] transition">
                <FiHome className="mr-2" />
                <span>Dashboard</span>
              </Link>
              <Link to="/portfolio" className="flex items-center hover:text-[#40916C] transition">
                <FiStar className="mr-2" />
                <span>Portfolio</span>
              </Link>
              <Link to="/ledger" className="flex items-center hover:text-[#40916C] transition">
                <FiBook className="mr-2" />
                <span>Ledger</span>
              </Link>
              <Link to="/settings" className="flex items-center hover:text-[#40916C] transition">
                <FiSettings className="mr-2" />
                <span>Settings</span>
              </Link>
              <button 
                onClick={handleLogout} 
                className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 text-white px-5 py-2 rounded-lg hover:bg-[#40916C] transition font-medium flex items-center"
              >
                <FiLogOut className="mr-2" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/about" className="flex items-center hover:text-[#40916C] transition">
                <FiInfo className="mr-2" />
                <span>About</span>
              </Link>
              <Link to="/features" className="flex items-center hover:text-[#40916C] transition">
                <FiStar className="mr-2" />
                <span>Features</span>
              </Link>
              <Link to="/login" className="flex items-center hover:text-[#40916C] transition">
                <FiUser className="mr-2" />
                <span>Login</span>
              </Link>
              <Link 
                to="/register" 
                className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 text-white px-5 py-2 rounded-lg hover:bg-[#40916C] transition font-medium flex items-center"
              >
                <FiUserPlus className="mr-2" />
                <span>Sign Up</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="focus:outline-none"
          >
            {mobileMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#184E77] bg-opacity-95 backdrop-blur-sm px-4 py-3">
          {isAuthenticated ? (
            <div className="flex flex-col space-y-3">
              <Link 
                to="/dashboard" 
                className="py-2 hover:text-[#40916C] flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiHome className="mr-2" />
                <span>Dashboard</span>
              </Link>
              <Link 
                to="/portfolio" 
                className="py-2 hover:text-[#40916C] flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiStar className="mr-2" />
                <span>Portfolio</span>
              </Link>
              <Link 
                to="/ledger" 
                className="py-2 hover:text-[#40916C] flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiBook className="mr-2" />
                <span>Ledger</span>
              </Link>
              <Link 
                to="/settings" 
                className="py-2 hover:text-[#40916C] flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiSettings className="mr-2" />
                <span>Settings</span>
              </Link>
              <button 
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }} 
                className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 text-white px-4 py-2 rounded-lg w-full text-center font-medium flex items-center justify-center"
              >
                <FiLogOut className="mr-2" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-3">
              <Link 
                to="/about" 
                className="py-2 hover:text-[#40916C] flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiInfo className="mr-2" />
                <span>About</span>
              </Link>
              <Link 
                to="/features" 
                className="py-2 hover:text-[#40916C] flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiStar className="mr-2" />
                <span>Features</span>
              </Link>
              <Link 
                to="/login" 
                className="py-2 hover:text-[#40916C] flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiUser className="mr-2" />
                <span>Login</span>
              </Link>
              <Link 
                to="/register" 
                className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 text-white px-4 py-2 rounded-lg w-full text-center font-medium flex items-center justify-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiUserPlus className="mr-2" />
                <span>Sign Up</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;