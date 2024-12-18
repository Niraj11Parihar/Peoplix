import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../assets/css/attendanceSheet.css"

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
    <div class="attendance-container">
    <h1 class="attendance-title">Attendance Sheet</h1>
  
    {/* Responsive Table */}
    <div class="table-wrapper">
      <table class="responsive-table">
        <thead>
          <tr>
            <th>Employee Name</th>
            {uniqueDates.map((date, index) => (
              <th key={index}>
                {new Date(date).getDate()} <br />
                {new Date(date).toLocaleString("default", { month: "short" })}
              </th>
            ))}
            <th>Consistency (%)</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(groupedData).map((employeeName) => {
            const records = groupedData[employeeName];
            const consistency = calculateConsistency(records);
  
            return (
              <tr key={employeeName}>
                <td>{employeeName}</td>
                {uniqueDates.map((date, index) => {
                  const record = records.find((r) => r.date === date);
                  return (
                    <td
                      key={index}
                      class={
                        record?.status === "Present"
                          ? "present"
                          : record?.status === "Absent"
                          ? "absent"
                          : "neutral"
                      }
                    >
                      {record?.status || "-"}
                    </td>
                  );
                })}
                <td>{consistency}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  
    <p class="responsive-message">
      Swipe left or right to view more columns on smaller screens.
    </p>
  </div>
  
  
  

  );
};

export default AttendanceSheet;
