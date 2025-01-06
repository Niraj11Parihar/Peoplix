import React, { useState } from "react";
import { FaUser, FaUserEdit, FaUsers } from "react-icons/fa";
import { MdDashboardCustomize } from "react-icons/md";
import { AiFillProject } from "react-icons/ai";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="flex flex-col h-full px-4 py-6">
      {/* Menu Items */}
      <nav className="flex-grow space-y-4">
        <ul>
          <li className="hover:bg-blue-700 py-3 rounded-md cursor-pointer flex items-center space-x-2">
            <MdDashboardCustomize />
            {isOpen && <Link to={"/"}>Dashboard</Link>}
          </li>
          <li className="hover:bg-blue-700 py-3 rounded-md cursor-pointer flex items-center space-x-2">
            <FaUser />
            {isOpen && <Link to={"/supervisors"}>Supervisors</Link>}
          </li>
          <li className="hover:bg-blue-700 py-3 rounded-md cursor-pointer flex items-center space-x-2">
            <FaUsers />
            {isOpen && <Link to={"/EmpDashboard"}>Employees</Link>}
          </li>
          <li className="hover:bg-blue-700 py-3 rounded-md cursor-pointer flex items-center space-x-2">
            <FaUserEdit />
            {isOpen && <Link to={"/Attendance"}>Attendance</Link>}
          </li>

          {/* Dropdown for Project Management */}
          <li
            className="relative hover:bg-blue-700 py-3 rounded-md cursor-pointer flex items-center space-x-2"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <AiFillProject />
            {isOpen && (
              <>
                <span>Projects</span>
                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <ul className="absolute  top-12 ml-4 bg-white shadow-lg rounded-md mt-2 w-48 z-10">
                    <li className="hover:bg-blue-700 py-3 rounded-md cursor-pointer flex items-center px-4">
                      <Link
                        to={"/ProjectManagement"}
                        className="text-gray-800 hover:text-white"
                      >
                        ProjectManagement
                      </Link>
                    </li>
                    {/* Add more dropdown items here if needed */}
                  </ul>
                )}
              </>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
