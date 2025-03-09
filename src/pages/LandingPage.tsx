import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { FiUser, FiUserPlus, FiCheck, FiBarChart2, FiClock, FiUsers } from 'react-icons/fi';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1B4332] to-[#184E77] text-[#F8F8F8] font-['Libre_Franklin']">
      <Navbar />
      
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 md:py-20">
        {/* Hero Section */}
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center">
          {/* Left Content */}
          <motion.div 
            className="md:w-1/2 text-left md:pr-12"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-['Fraunces'] text-5xl md:text-6xl font-bold mb-4">
              <span className="text-white">Welcome</span> <span className="text-white">Back</span>
            </h1>
            <p className="text-xl text-[#F8F8F8] mb-8 leading-relaxed">
              Your financial journey continues here. Track your progress, make informed decisions, and achieve your goals with precision and clarity.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
              <Link
                to="/register"
                className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 text-white px-8 py-3 rounded-lg font-medium hover:bg-[#40916C] transition transform hover:-translate-y-1 shadow-md text-center flex items-center justify-center"
              >
                <FiUserPlus className="mr-2" />
                <span>Get Started — It's Free</span>
              </Link>
              <Link
                to="/login"
                className="border border-[#F8F8F8] text-[#F8F8F8] px-8 py-3 rounded-lg font-medium hover:bg-[#40916C] hover:border-[#40916C] transition transform hover:-translate-y-1 text-center flex items-center justify-center"
              >
                <FiUser className="mr-2" />
                <span>Sign In</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2 text-[#F8F8F8]">
              <FiCheck className="h-5 w-5 text-[#40916C]" />
              <span>No credit card required</span>
            </div>
          </motion.div>
          
          {/* Right Content - Dashboard Preview */}
          <motion.div 
            className="md:w-1/2 mt-8 md:mt-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-[#F8F8F8] border-opacity-20">
              <div className="h-6 bg-[#1C1C1C] flex items-center px-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-[#9B2C2C] rounded-full"></div>
                  <div className="w-3 h-3 bg-[#40916C] rounded-full"></div>
                  <div className="w-3 h-3 bg-[#40916C] rounded-full"></div>
                </div>
              </div>
              <img 
                src="/images/dashboard-preview.png" 
                alt="Fiscus Dashboard" 
                className="w-full h-auto"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/600x400?text=Fiscus+Dashboard";
                }}
              />
            </div>
          </motion.div>
        </div>
        
        {/* Features Section */}
        <div className="container mx-auto max-w-6xl mt-20">
          <h2 className="font-['Fraunces'] text-3xl font-bold text-center mb-12 text-white">More than just a financial tracker</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-lg transition border border-[#F8F8F8] border-opacity-20">
              <div className="w-12 h-12 bg-[#40916C] bg-opacity-30 rounded-full flex items-center justify-center mb-4">
                <FiBarChart2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-['Fraunces'] text-xl font-semibold mb-2 text-white">Visual Analytics</h3>
              <p className="text-[#F8F8F8]">See where your money goes with intuitive charts and spending patterns.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-lg transition border border-[#F8F8F8] border-opacity-20">
              <div className="w-12 h-12 bg-[#40916C] bg-opacity-30 rounded-full flex items-center justify-center mb-4">
                <FiClock className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-['Fraunces'] text-xl font-semibold mb-2 text-white">Smart Budgeting</h3>
              <p className="text-[#F8F8F8]">Set goals, track progress, and receive personalized tips to improve your finances.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-lg transition border border-[#F8F8F8] border-opacity-20">
              <div className="w-12 h-12 bg-[#40916C] bg-opacity-30 rounded-full flex items-center justify-center mb-4">
                <FiUsers className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-['Fraunces'] text-xl font-semibold mb-2 text-white">Student-Focused</h3>
              <p className="text-[#F8F8F8]">Built specifically for students, with categories and insights relevant to your lifestyle.</p>
            </div>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="w-full bg-white bg-opacity-5 backdrop-blur-sm mt-20 py-12 rounded-xl border border-[#F8F8F8] border-opacity-20">
          <div className="container mx-auto text-center px-4">
            <h2 className="font-['Fraunces'] text-3xl font-bold mb-4 text-white">Ready to take control of your finances?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-[#F8F8F8]">Join thousands of students who are building financial skills that last a lifetime.</p>
            <Link
              to="/register"
              className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 text-white px-8 py-3 rounded-lg font-medium hover:bg-[#40916C] transition transform hover:-translate-y-1 shadow-md inline-block flex items-center justify-center"
            >
              <FiUserPlus className="mr-2" />
              <span>Create Your Free Account</span>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;