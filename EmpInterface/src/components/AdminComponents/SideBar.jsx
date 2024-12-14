import React from "react";
import { FaUser, FaUsers } from "react-icons/fa";
import { MdDashboardCustomize } from "react-icons/md";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen }) => {
  return (
    <div className="flex flex-col h-full px-4 py-6">
      {/* Menu Items */}
      <nav className="flex-grow space-y-4">
        <ul>
          <li className="hover:bg-blue-700 py-3 rounded-md cursor-pointer">
            <Link to={"/"}>{isOpen ? "Dashboard" : <MdDashboardCustomize />}</Link>
          </li>
          <li className="hover:bg-blue-700 py-3 rounded-md cursor-pointer">
            <Link>{isOpen ? "Supervisors" : <FaUser />}</Link>
          </li>
          <li className="hover:bg-blue-700 py-3 rounded-md cursor-pointer">
            <Link to={"/EmpDashboard"}>{isOpen ? "Employees" : <FaUsers />}</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
