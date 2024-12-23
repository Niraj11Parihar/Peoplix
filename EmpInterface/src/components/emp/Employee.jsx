import React, { useState, useEffect } from "react";
import axios from "axios";
import EmpLayout from "./EmpComponents/EmpLayout";
import { useNavigate } from "react-router-dom"; // You can use this hook to navigate to login page

const Employee = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendancePercentage, setAttendancePercentage] = useState(0);
  const [attendancePerformance, setAttendancePerformance] = useState("");
  const navigate = useNavigate(); // To navigate to the login page if token is missing

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  // Fetch attendance data for the logged-in employee or all employees (admin)
  const fetchAttendanceData = async () => {
    try {
      const token = localStorage.getItem("authToken");

      // Check if token is missing or invalid
      if (!token) {
        console.error("Token is missing or invalid");
        navigate("/login"); // Redirect to login page
        return;
      }

      const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode the JWT token to get user info
      const userId = decodedToken.id; // Get the user ID
      const userRole = decodedToken.role; // Get the user role

      // Send a GET request to the backend to fetch attendance data
      const response = await axios.get("http://localhost:8082/Attendance/getAttendanceRecords", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      // If the user is an employee, filter the data to show only their attendance
      const employeeAttendance = userRole === 'admin' ? data : data.filter((record) => record.employeeId === userId);

      // Calculate attendance percentage and performance
      const totalDays = employeeAttendance.length;
      const presentDays = employeeAttendance.filter((record) => record.status === "Present").length;
      const percentage = ((presentDays / totalDays) * 100).toFixed(2);

      setAttendanceData(employeeAttendance);
      setAttendancePercentage(percentage);
      setAttendancePerformance(calculateAttendancePerformance(percentage));
    } catch (err) {
      console.error("Error fetching attendance records:", err);
    }
  };

  // Function to calculate performance based on attendance percentage
  const calculateAttendancePerformance = (attendancePercentage) => {
    if (attendancePercentage >= 95) {
      return "Performance: Excellent";
    } else if (attendancePercentage >= 85) {
      return "Performance: Good";
    } else {
      return "Performance: Needs Improvement";
    }
  };

  // Get the unique dates
  const uniqueDates = Array.from(
    new Set(attendanceData.map((record) => new Date(record.date).toISOString().split("T")[0]))
  );

  // Get the status for each date
  const getStatusForDate = (date) => {
    const record = attendanceData.find((r) => new Date(r.date).toISOString().split("T")[0] === date);
    return record ? record.status : "Absent"; // Default to "Absent" if no record found
  };

  return (
    <EmpLayout>
      <h1 className="text-2xl font-bold mb-4">Employee Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-teal-500 text-white rounded-lg p-4 shadow-lg">
          <h2 className="text-lg font-semibold">Salary</h2>
          <p className="text-xl">$25,000</p>
        </div>
        <div className="bg-orange-500 text-white rounded-lg p-4 shadow-lg">
          <h2 className="text-lg font-semibold">Attendance</h2>
          <p className="text-xl">{attendancePercentage}% Present</p>
          <p className="text-sm mt-1">{attendancePerformance}</p>
        </div>
        <div className="bg-pink-500 text-white rounded-lg p-4 shadow-lg">
          <h2 className="text-lg font-semibold">Leaves</h2>
          <p className="text-xl">3 Days</p>
        </div>
        <div className="bg-blue-500 text-white rounded-lg p-4 shadow-lg">
          <h2 className="text-lg font-semibold">Projects</h2>
          <p className="text-xl">2 Active</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Attendance Calendar</h2>
        <div className="grid grid-cols-7 gap-2">
          {uniqueDates.map((date, index) => {
            const status = getStatusForDate(date);
            const statusClass = status === "Present" ? "bg-green-500" : status === "Absent" ? "bg-red-500" : "bg-yellow-500";

            return (
              <div
                key={index}
                className={`p-2 rounded-md text-center ${statusClass} text-white`}
              >
                {new Date(date).getDate()}
              </div>
            );
          })}
        </div>
      </div>
    </EmpLayout>
  );
};

export default Employee;
