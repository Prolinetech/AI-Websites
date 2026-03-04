import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-navy-900 text-white sticky top-0 z-50 shadow-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 font-serif text-2xl font-bold text-gold-500 tracking-wider">
              PROLINE
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link to="/" className="hover:text-gold-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
                
                <div className="relative group">
                  <button 
                    onClick={() => setSolutionsOpen(!solutionsOpen)}
                    className="flex items-center hover:text-gold-400 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none"
                  >
                    Solutions <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  
                  {/* Dropdown */}
                  <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-navy-800 ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block">
                    <div className="py-1" role="menu">
                      <Link to="/solutions/consultancy" className="block px-4 py-2 text-sm text-gray-300 hover:bg-navy-700 hover:text-white">Consultancy</Link>
                      <Link to="/solutions/recruitment" className="block px-4 py-2 text-sm text-gray-300 hover:bg-navy-700 hover:text-white">Recruitment</Link>
                      <Link to="/solutions/training" className="block px-4 py-2 text-sm text-gray-300 hover:bg-navy-700 hover:text-white">Training</Link>
                      <Link to="/solutions/revenue" className="block px-4 py-2 text-sm text-gray-300 hover:bg-navy-700 hover:text-white">Revenue Optimization</Link>
                    </div>
                  </div>
                </div>

                <Link to="/training-events" className="hover:text-gold-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Training & Events</Link>
                <Link to="/jobs" className="hover:text-gold-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Jobs</Link>
                <Link to="/contact" className="hover:text-gold-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Contact</Link>
              </div>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link 
                    to={user.role === 'admin' ? '/admin' : user.role === 'employer' ? '/employer/dashboard' : '/candidate/dashboard'}
                    className="flex items-center text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                  <Link to="/register" className="bg-gold-500 text-navy-900 hover:bg-gold-400 px-4 py-2 rounded-md text-sm font-bold transition-colors shadow-md">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-navy-700 focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-navy-800"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Home</Link>
              <Link to="/solutions/consultancy" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Consultancy</Link>
              <Link to="/solutions/recruitment" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Recruitment</Link>
              <Link to="/solutions/training" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Training</Link>
              <Link to="/training-events" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Training & Events</Link>
              <Link to="/jobs" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Jobs</Link>
              
              {user ? (
                <>
                  <Link to="/dashboard" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Dashboard</Link>
                  <button onClick={handleLogout} className="text-gray-300 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Login</Link>
                  <Link to="/register" className="text-gold-500 hover:text-gold-400 block px-3 py-2 rounded-md text-base font-medium">Register</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
