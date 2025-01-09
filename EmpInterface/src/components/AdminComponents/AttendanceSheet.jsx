import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const AttendanceSheet = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [uniqueDates, setUniqueDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // 0-based (Jan = 0)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  const fetchAttendanceRecords = async () => {
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
      const data = response.data;

      setAttendanceData(data);

      // Extract unique dates from data
      const dates = Array.from(
        new Set(
          data.map(
            (record) => new Date(record.date).toISOString().split("T")[0]
          )
        )
      );
      setUniqueDates(dates.sort());
    } catch (err) {
      console.error("Error fetching attendance records:", err);
    }
  };

  const handleMonthChange = (direction) => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear((prevYear) => prevYear - 1);
      } else {
        setCurrentMonth((prevMonth) => prevMonth - 1);
      }
    } else if (direction === "next") {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear((prevYear) => prevYear + 1);
      } else {
        setCurrentMonth((prevMonth) => prevMonth + 1);
      }
    }
  };

  // Filter unique dates by the current month and year
  const filteredDates = uniqueDates.filter((date) => {
    const dateObj = new Date(date);
    return (
      dateObj.getMonth() === currentMonth &&
      dateObj.getFullYear() === currentYear
    );
  });

  // Group data by employee name
  const groupedData = attendanceData.reduce((acc, record) => {
    const employeeName = record.employeeDetails?.name || "Unknown";
    if (!acc[employeeName]) acc[employeeName] = [];
    acc[employeeName].push({
      date: new Date(record.date).toISOString().split("T")[0],
      status: record.status,
    });
    return acc;
  }, {});

  // **Original consistency calculation logic remains unchanged**
  const calculateConsistency = (records) => {
    const employeeDates = uniqueDates.filter((date) =>
      records.some((r) => r.date === date)
    );

    const totalDays = employeeDates.length;

    const attendanceScore = records.reduce((count, record) => {
      if (record.status === "Present") {
        return count + 1;
      } else if (record.status === "Half Day") {
        return count + 0.5;
      } else if (record.status === "Leave") {
        return count + 1;
      } else if (record.status === "Absent") {
        count - 1;
        if (count < 0) {
          return (count = 0);
        }
      }
      return count;
    }, 0);

    return totalDays > 0
      ? ((attendanceScore / totalDays) * 100).toFixed(2)
      : "N/A";
  };

  return (
    <div className="p-6 rounded-lg shadow-lg bg-gray-100 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
        Attendance Sheet
      </h1>

      {/* Month Navigation */}
      <div className="mb-4 flex items-center justify-center space-x-6">
        {/* Previous Month Button */}
        <button
          onClick={() => handleMonthChange("prev")}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition duration-200 ease-in-out"
        >
          <FaArrowLeft className="mr-2" />
          Previous
        </button>

        {/* Current Month and Year */}
        <span className="text-xl font-semibold text-gray-800 bg-gray-200 px-6 py-2 rounded-md shadow-md">
          {new Date(currentYear, currentMonth).toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </span>

        {/* Next Month Button */}
        <button
          onClick={() => handleMonthChange("next")}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition duration-200 ease-in-out"
        >
          Next
          <FaArrowRight className="ml-2" />
        </button>
      </div>

      {/* Scrollable Table */}
      <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md w-full">
        <table className="w-full min-w-[800px] border border-gray-300">
          <thead>
            <tr>
              <th className="bg-blue-300 text-gray-800 px-4 py-2 border border-gray-300">
                Employee Name
              </th>
              {filteredDates.map((date, index) => (
                <th
                  key={index}
                  className="bg-blue-300 text-gray-800 px-4 py-2 border border-gray-300"
                >
                  {new Date(date).getDate()} <br />
                  {new Date(date).toLocaleString("default", { month: "short" })}
                </th>
              ))}
              <th className="bg-blue-300 text-gray-800 px-4 py-2 border border-gray-300">
                Consistency (%)
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(groupedData).map((employeeName) => {
              const records = groupedData[employeeName];
              const consistency = calculateConsistency(records);

              return (
                <tr key={employeeName}>
                  <td className="bg-gray-200 text-gray-800 px-4 py-2 border border-gray-300">
                    {employeeName}
                  </td>
                  {filteredDates.map((date, index) => {
                    const record = records.find((r) => r.date === date);
                    return (
                      <td
                        key={index}
                        className={`${
                          record?.status === "Present"
                            ? "bg-green-200 text-green-700"
                            : record?.status === "Absent"
                            ? "bg-red-200 text-red-700"
                            : record?.status === "Half Day"
                            ? "bg-yellow-200 text-yellow-700"
                            : record?.status === "Leave"
                            ? "bg-blue-200 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        } px-4 py-2 border border-gray-300`}
                      >
                        {record?.status || "-"}
                      </td>
                    );
                  })}
                  <td className="bg-gray-200 text-gray-800 px-4 py-2 border border-gray-300">
                    {consistency}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceSheet;
