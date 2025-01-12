import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { FaLeaf, FaShoppingBag, FaHeart, FaTrophy, FaUser, FaSignOutAlt } from "react-icons/fa";

const Navbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNavbar, setShowNavbar] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  let lastScrollTop = 0;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setScrolled(currentScrollTop > 20);
      
      if (currentScrollTop > lastScrollTop) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    auth.signOut().then(() => {
      onLogout();
      navigate("/login");
    });
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children, icon: Icon }) => (
    <Link
      to={to}
      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group
        ${isActive(to) 
          ? 'bg-white text-green-600 shadow-md' 
          : 'text-white hover:bg-green-500'}`}
    >
      <Icon className={`mr-2 text-lg ${isActive(to) ? 'text-green-600' : 'text-white'}`} />
      <span>{children}</span>
    </Link>
  );

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 -mt-4 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      } ${
        scrolled 
          ? "bg-green-600/95 backdrop-blur-sm shadow-lg" 
          : "bg-green-600"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
          >
            <FaLeaf className="text-white text-2xl group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-xl font-bold text-white tracking-wide">
              Eco<span className="text-green-200">Place</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            <NavLink to="/marketplace" icon={FaShoppingBag}>Marketplace</NavLink>
            <NavLink to="/wishlist" icon={FaHeart}>Wishlist</NavLink>
            <NavLink to="/leaderboard" icon={FaTrophy}>Leaderboard</NavLink>
            
            {isAuthenticated ? (
              <>
                <NavLink to="/profile" icon={FaUser}>Profile</NavLink>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-green-500 transition-all duration-300"
                >
                  <FaSignOutAlt className="mr-2 text-lg" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-white text-sm font-medium hover:bg-green-500 rounded-lg transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-white text-green-600 rounded-lg text-sm font-medium 
                    hover:bg-green-50 transition-colors duration-300 shadow-md hover:shadow-lg
                    flex items-center space-x-2"
                >
                  <FaLeaf className="text-green-600" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden flex items-center">
            <svg className="w-6 h-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M4 6h16M4 12h16m-16 6h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;