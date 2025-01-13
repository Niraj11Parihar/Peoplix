import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../features/Layout";
import EmployeeStreamPieChart from "../AdminComponents/EmpStreamChart";
import RecentlyJoinedEmp from "../AdminComponents/RecentlyJoinedEmp";
import TaskFrequencyChart from "../AdminComponents/TaskFrequencyChart";
import ProjectTaskTable from "../AdminComponents/ProjectworkOverview";

function AdminPanel() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendancePercentage, setAttendancePercentage] = useState(0);
  const [attendancePerformance, setAttendancePerformance] = useState("");
  const [liveProjectsCount, setLiveProjectsCount] = useState(0);
  const [TotalEmp, setTotalEmp] = useState(0);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          "http://localhost:8011/Attendance/getAttendanceRecords",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const records = response.data;
        setAttendanceData(records);
        calculateAttendancePerformance(records);

        // total employee length
        const EmpLength = await axios.get(
          "http://localhost:8011/Emp/getAllEmployees",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTotalEmp(EmpLength.data.length);
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
          "http://localhost:8011/Projects/getProjects",
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
            <h2 className="text-2xl font-bold text-white">Total Employees</h2>
            <p className="text-white  text-xl mt-2">{TotalEmp}</p>
          </div>

          {/* Attendance Box */}
          <div className="bg-gradient-to-br from-orange-500 to-yellow-500 shadow-lg rounded-lg p-4 text-center transform transition-transform duration-300 hover:scale-105">
            <h2 className="text-2xl font-bold text-white">Attendance</h2>
            <p className="text-white  text-xl mt-2">
              {attendancePercentage}% Present
            </p>
            <p className="text-white text-sm mt-1">
              Performance: {attendancePerformance}
            </p>
          </div>

          {/* Leaves Box */}
          <div className="bg-gradient-to-br from-red-500 to-pink-500 shadow-lg rounded-lg p-4 text-center transform transition-transform duration-300 hover:scale-105">
            <h2 className="text-2xl font-bold text-white">Leaves</h2>
            <p className="text-white  text-xl mt-2">3 Days</p>
          </div>

          {/* Projects Box */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg rounded-lg p-4 text-center transform transition-transform duration-300 hover:scale-105">
            <h2 className="text-2xl font-bold text-white">Projects</h2>
            <p className="text-white  text-xl mt-2">{liveProjectsCount} Live</p>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg rounded-lg mt-8 p-4 transform transition-transform duration-300 hover:scale-95 hover:shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">
            Peoplix
          </h2>
          <p className="text-white text-opacity-90">
            Peoplix is a powerful employee management platform designed to
            streamline and enhance workplace operations. It offers a
            comprehensive suite of tools to manage employee data, monitor
            attendance and track leaves. With
            Peoplix, businesses can easily maintain detailed employee records,
            ensure compliance, and generate actionable insights through advanced
            analytics.
          </p>
          <button className="mt-6 px-6 py-3 bg-white text-blue-600 font-medium rounded-md shadow-md transition-transform transform hover:-translate-y-1 hover:scale-105">
            Learn More
          </button>
        </div>

        <div className="lg:flex  mt-4 gap-6">
          {/* Chart of Task Frequency */}
          <div className="w-full   lg:w-1/2 ">
            <TaskFrequencyChart />
          </div>

          {/* Employee Stream Pie Chart */}
          <div className="mt-8 w-full lg:w-1/2 lg:m-0">
            {/* Project work overview /> */}
            <ProjectTaskTable />
          </div>
        </div>

        <div className="lg:flex  mt-8 gap-6">
          {/* Recently Joined Employees Table */}
          <div className="w-full">
            <RecentlyJoinedEmp />
          </div>

          {/* Employee Stream Pie Chart */}
          <div className="mt-8 w-full lg:w-1/4 lg:m-0">
            <EmployeeStreamPieChart />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AdminPanel;
