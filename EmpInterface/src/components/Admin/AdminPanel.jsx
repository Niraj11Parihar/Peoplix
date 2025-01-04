import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../features/Layout";
import EmployeeStreamPieChart from "../AdminComponents/EmpStreamChart";
import RecentlyJoinedEmp from "../AdminComponents/RecentlyJoinedEmp";

function AdminPanel() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendancePercentage, setAttendancePercentage] = useState(0);
  const [attendancePerformance, setAttendancePerformance] = useState("");
  const [liveProjectsCount, setLiveProjectsCount] = useState(0);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          "http://localhost:8082/Attendance/getAttendanceRecords",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const records = response.data;
        setAttendanceData(records);
        calculateAttendancePerformance(records);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchAttendanceData();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          "http://localhost:8082/Projects/getProjects",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const projects = response.data.projects || [];
        const liveProjects = projects.filter(
          (project) => project.Projectstatus === "In Progress"
        );
        setLiveProjectsCount(liveProjects.length);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const calculateAttendancePerformance = (records) => {
    const totalEmployees = records.length;
    const presentCount = records.reduce((count, record) => {
      if (record.status === "Present") return count + 1;
      if (record.status === "Half Day") return count + 0.5;
      if (record.status === "Leave") return count + 1;
      return count;
    }, 0);

    const percentage = (presentCount / totalEmployees) * 100;
    setAttendancePercentage(percentage.toFixed(2));

    if (percentage >= 90) {
      setAttendancePerformance("Excellent");
    } else if (percentage >= 75) {
      setAttendancePerformance("Good");
    } else {
      setAttendancePerformance("Needs Improvement");
    }
  };

  return (
    <Layout>
      <div className="px-4 py-6 min-h-screen bg-gradient-to-r from-blue-100 to-blue-300">
        <h1 className="text-3xl font-bold text-gray-700 mb-6">
          Welcome to Admin Dashboard
        </h1>

        {/* Grid for Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Salary Box */}
          <div className="bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg rounded-lg p-4 text-center transform transition-transform duration-300 hover:scale-105">
            <h2 className="text-xl font-semibold text-white">Salary</h2>
            <p className="text-white text-lg mt-2">$25,000</p>
          </div>

          {/* Attendance Box */}
          <div className="bg-gradient-to-br from-orange-500 to-yellow-500 shadow-lg rounded-lg p-4 text-center transform transition-transform duration-300 hover:scale-105">
            <h2 className="text-xl font-semibold text-white">Attendance</h2>
            <p className="text-white text-lg mt-2">
              {attendancePercentage}% Present
            </p>
            <p className="text-white text-sm mt-1">
              Performance: {attendancePerformance}
            </p>
          </div>

          {/* Leaves Box */}
          <div className="bg-gradient-to-br from-red-500 to-pink-500 shadow-lg rounded-lg p-4 text-center transform transition-transform duration-300 hover:scale-105">
            <h2 className="text-xl font-semibold text-white">Leaves</h2>
            <p className="text-white text-lg mt-2">3 Days</p>
          </div>

          {/* Projects Box */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg rounded-lg p-4 text-center transform transition-transform duration-300 hover:scale-105">
            <h2 className="text-xl font-semibold text-white">Projects</h2>
            <p className="text-white text-lg mt-2">{liveProjectsCount} Live</p>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="bg-white shadow-md rounded-lg mt-8 p-6 transform transition-transform duration-300 hover:scale-101">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Employee Management
          </h2>
          <p className="text-gray-600">
            Manage all aspects of your employee data, including salary,
            attendance, leaves, and more. Explore detailed statistics and
            insights.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start mt-8 gap-6">
          {/* Recently Joined Employees Table */}
          <div className="w-full">
            <RecentlyJoinedEmp />
          </div>

          {/* Employee Stream Pie Chart */}
          <div className="w-full sm:w-1/2 lg:w-full">
            <EmployeeStreamPieChart />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AdminPanel;
