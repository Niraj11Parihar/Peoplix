import React from "react";
import { AiFillProject } from "react-icons/ai";
import {FaUserEdit} from "react-icons/fa";
import { MdDashboardCustomize } from "react-icons/md";
import { Link } from "react-router-dom";

const EmpSidebar = ({ isOpen }) => {
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
            <AiFillProject />
            {isOpen && <Link to={"/EmpProjects"}>Projects</Link>}
          </li>
          <li className="hover:bg-blue-700 py-3 rounded-md cursor-pointer flex items-center space-x-2">
            <FaUserEdit />
            {isOpen && <Link to={"/Attendance"}>Attendance</Link>}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default EmpSidebar;
