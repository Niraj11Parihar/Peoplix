import React from "react";
import Layout from "../../features/Layout"; // Assuming Layout is your common wrapper

function AdminPanel() {
  return (
    <Layout>
      {/* Header */}
      <div className="px-6 py-4">
        <h1 className="text-3xl font-bold text-gray-700 mb-6">
          Welcome to Admin Dashboard
        </h1>

        {/* Grid for Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Salary Box */}
          <div className="bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg rounded-lg p-4 text-center transform transition-transform duration-300 hover:scale-105">
            <h2 className="text-xl font-semibold text-white">Salary</h2>
            <p className="text-white text-lg mt-2">$25,000</p>
          </div>

          {/* Attendance Box */}
          <div className="bg-gradient-to-br from-orange-500 to-yellow-500 shadow-lg rounded-lg p-4 text-center transform transition-transform duration-300 hover:scale-105">
            <h2 className="text-xl font-semibold text-white">Attendance</h2>
            <p className="text-white text-lg mt-2">95%</p>
          </div>

          {/* Leaves Box */}
          <div className="bg-gradient-to-br from-red-500 to-pink-500 shadow-lg rounded-lg p-4 text-center transform transition-transform duration-300 hover:scale-105">
            <h2 className="text-xl font-semibold text-white">Leaves</h2>
            <p className="text-white text-lg mt-2">3 Days</p>
          </div>

          {/* Projects Box */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg rounded-lg p-4 text-center transform transition-transform duration-300 hover:scale-105">
            <h2 className="text-xl font-semibold text-white">Projects</h2>
            <p className="text-white text-lg mt-2">2 Active</p>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="bg-white shadow-md rounded-lg mt-8 p-6 transform transition-transform duration-300 hover:scale-101">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Employee Management
          </h2>
          <p className="text-gray-600">
            Manage all aspects of your employee data, including salary, attendance, leaves, and more. Explore detailed statistics and insights.
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default AdminPanel;
