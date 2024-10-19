import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const UserDropdown = ({ email, name, isAuthenticated }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center p-2 border rounded-md focus:outline-none"
      >
        <div className="w-6 h-6 bg-gray-400 rounded-full mr-2"></div>
        <span className="text-sm">{name}</span>
        <svg
          className="ml-2 w-4 h-4 "
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md  z-10">
          <div className="p-4">
           
            <Link
              to="/"
              className="block w-full border-2 border-gray-200  text-left mt-3 text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded transition"
            >
              Logout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
