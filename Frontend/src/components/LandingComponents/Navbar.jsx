import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <header className="relative">
      <div className=" bg-gray-50">
        {/* Navbar */}
        <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex-shrink-0 text-2xl font-bold text-blue-600">
                ABC School
              </div>

              {/* Desktop Menu */}
              <div className="hidden md:flex space-x-8">
                <a href="#home" className="hover:text-blue-600 font-medium">
                  Home
                </a>
                <a href="#about" className="hover:text-blue-600 font-medium">
                  About
                </a>
                <a href="#features" className="hover:text-blue-600 font-medium">
                  Features
                </a>
                <a href="#contact" className="hover:text-blue-600 font-medium">
                  Contact
                </a>
              </div>

              {/* Login Dropdown */}
              <div className="hidden md:flex space-x-4">
                <button
                  onClick={handleLoginClick}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Admin Login
                </button>
                <button
                  onClick={() => navigate("/login/teacher")}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Teacher Login
                </button>
                <button
                  onClick={() => navigate("/login/student")}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                >
                  Student Login
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
