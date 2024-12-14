import React, { useState } from "react";
import Sidebar from "../components/AdminComponents/SideBar";
import Header from "../components/AdminComponents/header";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen overflow-hidden w-full">
      {/* Sidebar */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-10 ${isSidebarOpen ? "block" : "hidden"}`}
        onClick={toggleSidebar}
      ></div>

      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-0"
        } bg-blue-900 text-white transition-all duration-300 fixed top-0 left-0 bottom-0 overflow-hidden z-20`}
      >
        <Sidebar isOpen={isSidebarOpen} />
      </div>

      {/* Main Content */}
      <div
        className={`flex-grow flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Content Section */}
        <div className="flex-grow p-6 bg-gray-50 overflow-auto w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
