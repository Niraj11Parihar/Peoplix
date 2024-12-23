import React, { useState } from "react";
import EmpSidebar from "./EmpSideBar";
import EmpHeader from "./EmpHeader";

const EmpLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen overflow-hidden w-full bg-gradient-to-r from-blue-100 to-blue-300">
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-10 bg-black bg-opacity-30 ${isSidebarOpen ? "block" : "hidden"}`}
        onClick={toggleSidebar}
      ></div>

      {/* Sidebar */}
      <div
        className={`${isSidebarOpen ? "w-64" : "w-0"} bg-gradient-to-b from-blue-900 to-indigo-700 text-white transition-all duration-300 fixed top-0 left-0 bottom-0 overflow-hidden z-20 shadow-lg`}
      >
        <EmpSidebar isOpen={isSidebarOpen} />
      </div>

      {/* Main Content */}
      <div className={`flex-grow flex flex-col transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        {/* Header */}
        <EmpHeader toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        {/* Content Section */}
        <div className="flex-grow p-6 bg-gradient-to-r from-blue-100 to-blue-300 overflow-auto w-full shadow-lg rounded-lg">
          {children}
        </div>
      </div>
    </div>
  );
};

export default EmpLayout;
