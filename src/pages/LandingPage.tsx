// src/pages/LandingPage.tsx
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center bg-white text-center px-4">
        <h1 className="text-5xl font-bold text-blue-600 mb-4">track. save. grow.</h1>
        <p className="text-xl text-gray-700 max-w-lg mb-8">
          The simple and smart personal finance app designed specifically for high school students.
          Track your expenses, reach your savings goals, and learn financial responsibility.
        </p>
        <div className="flex space-x-4">
          <Link
            to="/register"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition"
          >
            Login
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;