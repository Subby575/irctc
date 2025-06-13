import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

function Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn, role, logout } = useAuth();
  const [openMenu,setOpenMenu]=useState(false)
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-blue-800 hover:text-blue-900 transition-colors duration-200">
              RailBook
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
              >
                Search Trains
              </Link>
              
              {isLoggedIn && (
                <>
                  <Link 
                    to="/my-bookings" 
                    className="text-gray-700 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                  >
                    My Bookings
                  </Link>
                  {role === 'admin' && (
                    <Link 
                      to="/admin/add-train" 
                      className="text-gray-700 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                    >
                      Admin Panel
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Auth */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center space-x-4">
              {!isLoggedIn ? (
                <>
                  <Link 
                    to="/login" 
                    className="text-gray-700 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="bg-blue-800 text-white hover:bg-blue-900 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-sm"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <button 
                  onClick={handleLogout}
                  className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-sm"
                >
                  Logout
                </button>
              )}
            </div>
          </div>

          {/* Mobile buttons */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={()=>{setOpenMenu(!openMenu)}}
              className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-700 hover:text-blue-800 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden transition-all">
       {
        openMenu?
        <>
         <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200 transition-all">
          <Link 
            to="/" 
            className="text-gray-700 hover:text-blue-800 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
          >
            Search Trains
          </Link>
          
          {isLoggedIn && (
            <>
              <Link 
                to="/my-bookings" 
                className="text-gray-700 hover:text-blue-800 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
              >
                My Bookings
              </Link>
              {role === 'admin' && (
                <Link 
                  to="/admin/add-train" 
                  className="text-gray-700 hover:text-blue-800 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
                >
                  Admin Panel
                </Link>
              )}
            </>
          )}
          
          {!isLoggedIn ? (
            <>
              <Link 
                to="/login" 
                className="text-gray-700 hover:text-blue-800 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="bg-blue-800 text-white hover:bg-blue-900 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 mx-3 text-center"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button 
              onClick={handleLogout}
              className="bg-red-600 text-white hover:bg-red-700 block w-24 text-left px-5 py-2 rounded-md text-base font-medium transition-colors duration-200 mx-3"
            >
              Logout
            </button>
          )}
        </div>
        </>
        :null
       }
      </div>
    </nav>
  );
}

export default Navbar;
