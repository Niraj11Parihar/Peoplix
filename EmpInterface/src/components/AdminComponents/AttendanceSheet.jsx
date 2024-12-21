import React, { useState, useEffect } from "react";
import axios from "axios";

const AttendanceSheet = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [uniqueDates, setUniqueDates] = useState([]);

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  const fetchAttendanceRecords = async () => {
    try {
      const response = await axios.get("http://localhost:8082/Attendance/getAttendanceRecords");
      const data = response.data;

      setAttendanceData(data);

      // Extract unique dates from data
      const dates = Array.from(
        new Set(data.map((record) => new Date(record.date).toISOString().split("T")[0]))
      );
      setUniqueDates(dates.sort());
    } catch (err) {
      console.error("Error fetching attendance records:", err);
    }
  };

  // Group data by employee name
  const groupedData = attendanceData.reduce((acc, record) => {
    const employeeName = record.employeeDetails?.name || "Unknown";
    if (!acc[employeeName]) acc[employeeName] = [];
    acc[employeeName].push({ date: new Date(record.date).toISOString().split("T")[0], status: record.status });
    return acc;
  }, {});

  // Calculate consistency percentage
  const calculateConsistency = (records) => {
    const totalDays = uniqueDates.length;
    const presentDays = records.filter((r) => r.status === "Present").length;
    return ((presentDays / totalDays) * 100).toFixed(2);
  };

  return (
    <div className="p-6 rounded-lg shadow-lg bg-gray-100 flex flex-col items-center justify-center">
    <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Attendance Sheet</h1>
  
    {/* Make the table scrollable on small screens */}
    <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md w-full">
      <table className="w-full min-w-[800px] border border-gray-300">
        <thead>
          <tr>
            <th className="bg-blue-300 text-gray-800 px-4 py-2 border border-gray-300">Employee Name</th>
            {uniqueDates.map((date, index) => (
              <th key={index} className="bg-blue-300 text-gray-800 px-4 py-2 border border-gray-300">
                {new Date(date).getDate()} <br />
                {new Date(date).toLocaleString("default", { month: "short" })}
              </th>
            ))}
            <th className="bg-blue-300 text-gray-800 px-4 py-2 border border-gray-300">Consistency (%)</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(groupedData).map((employeeName) => {
            const records = groupedData[employeeName];
            const consistency = calculateConsistency(records);
  
            return (
              <tr key={employeeName}>
                <td className="bg-gray-200 text-gray-800 px-4 py-2 border border-gray-300">{employeeName}</td>
                {uniqueDates.map((date, index) => {
                  const record = records.find((r) => r.date === date);
                  return (
                    <td
                      key={index}
                      className={`${
                        record?.status === "Present"
                          ? "bg-green-200 text-green-700"
                          : record?.status === "Absent"
                          ? "bg-red-200 text-red-700"
                          : "bg-yellow-200 text-yellow-700"
                      } px-4 py-2 border border-gray-300`}
                    >
                      {record?.status || "-"}
                    </td>
                  );
                })}
                <td className="bg-gray-200 text-gray-800 px-4 py-2 border border-gray-300">{consistency}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  
    <p className="text-sm text-gray-700 mt-4">
      Swipe left or right to view more columns on smaller screens.
    </p>
  </div>
  
  );
};

export default AttendanceSheet;
