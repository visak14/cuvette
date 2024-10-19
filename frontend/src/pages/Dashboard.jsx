import React from 'react';
import { Outlet, Link } from 'react-router-dom'; 
import { FaHome } from 'react-icons/fa';
import { MdPostAdd } from "react-icons/md";
import { MdOutlineGridView } from "react-icons/md";

const Dashboard = () => {
  return (
    <div className="flex h-[100vh]  bg-gray-100">
    
      <div className="w-16 bg-white border-r-2 border-gray-300  flex flex-col gap-4 items-center py-6">
        <Link to="/dashboard">
          <FaHome className="text-black text-3xl mb-4" />
        </Link>
        <Link to="jobs">
          <MdOutlineGridView className="text-black text-3xl mb-4" />
        </Link>
        <Link to="post-job">
          <MdPostAdd className="text-black text-3xl mb-4" />
        </Link>
      </div>

  
      <div className="flex-grow p-6">
   
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
